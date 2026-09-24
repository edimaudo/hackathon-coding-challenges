from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _


class User(AbstractUser):
    """
    Extends Django's built-in user (which already gives us hashed passwords,
    session auth, and protection against common auth pitfalls).

    Global roles are limited to one flag: is_administrator. USER / SUPERVISOR /
    AUDITOR are never global — they are granted per form via FormRoleAssignment,
    per the spec ("an individual can be a USER on one form and a SUPERVISOR on
    another, but cannot be both on the same form").
    """

    initials = models.CharField(
        _("initials"),
        max_length=6,
        blank=True,
        help_text=_("Used to stamp entries on multi-user forms, e.g. 'JJS'."),
    )
    is_administrator = models.BooleanField(
        _("administrator"),
        default=False,
        help_text=_("Can manage users and per-form role assignments and predefined values."),
    )
    must_change_password = models.BooleanField(
        _("must change password"),
        default=True,
        help_text=_("Forces a password change on next login. Set automatically for new accounts."),
    )

    def __str__(self):
        full = self.get_full_name()
        return f"{full} ({self.username})" if full else self.username


class FormType(models.Model):
    """One row per BRC record type (Cooked Production Yield Log, etc.).

    Every record type is registered here even before its data-entry screens
    exist, so the admin can already assign roles to it and it shows up
    consistently across the dashboard, role matrix, and audit search.
    """

    PRIORITY_HIGH = "HIGH"
    PRIORITY_MEDIUM = "MEDIUM"
    PRIORITY_CHOICES = [
        (PRIORITY_HIGH, _("High")),
        (PRIORITY_MEDIUM, _("Medium")),
    ]

    code = models.SlugField(_("code"), unique=True)
    name_en = models.CharField(_("name (English)"), max_length=150)
    name_es = models.CharField(_("name (Spanish)"), max_length=150, blank=True)
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default=PRIORITY_MEDIUM)
    is_implemented = models.BooleanField(
        default=False,
        help_text="Whether this form's data-entry screens exist yet in the app.",
    )
    url_name = models.CharField(
        max_length=100,
        blank=True,
        help_text="URL namespace:name to the form's list view, once implemented.",
    )
    sort_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["sort_order", "name_en"]

    def __str__(self):
        return self.name_en

    def display_name(self, language_code):
        if language_code == "es" and self.name_es:
            return self.name_es
        return self.name_en


class FormRoleAssignment(models.Model):
    """Grants exactly one role to one user on one form type."""

    ROLE_USER = "USER"
    ROLE_SUPERVISOR = "SUPERVISOR"
    ROLE_AUDITOR = "AUDITOR"
    ROLE_CHOICES = [
        (ROLE_USER, _("User (enters data)")),
        (ROLE_SUPERVISOR, _("Supervisor (reviews & approves)")),
        (ROLE_AUDITOR, _("Auditor (read-only)")),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="form_roles")
    form_type = models.ForeignKey(FormType, on_delete=models.CASCADE, related_name="role_assignments")
    role = models.CharField(max_length=12, choices=ROLE_CHOICES)
    is_active = models.BooleanField(default=True)

    class Meta:
        # This is what actually enforces "one role per user per form":
        # a user can appear once per form_type, full stop.
        constraints = [
            models.UniqueConstraint(fields=["user", "form_type"], name="one_role_per_user_per_form")
        ]

    def __str__(self):
        return f"{self.user} → {self.role} on {self.form_type}"


class PredefinedValue(models.Model):
    """
    Admin-managed dropdown options, scoped to a form type + a field key
    (e.g. form_type=cooked-yield, field_key='product_type'). Deactivating
    a value keeps historical records intact while hiding it from new entries.
    """

    form_type = models.ForeignKey(FormType, on_delete=models.CASCADE, related_name="predefined_values")
    field_key = models.SlugField(help_text="Which dropdown this belongs to, e.g. 'product_type'.")
    value_en = models.CharField(max_length=200)
    value_es = models.CharField(max_length=200, blank=True)
    is_active = models.BooleanField(default=True)
    sort_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["field_key", "sort_order", "value_en"]
        constraints = [
            models.UniqueConstraint(
                fields=["form_type", "field_key", "value_en"], name="unique_value_per_field"
            )
        ]

    def __str__(self):
        return f"{self.form_type.code}:{self.field_key} = {self.value_en}"

    def display_value(self, language_code):
        if language_code == "es" and self.value_es:
            return self.value_es
        return self.value_en
