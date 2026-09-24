from django import forms
from django.contrib.auth.forms import AuthenticationForm
from django.utils.translation import gettext_lazy as _

from .models import FormRoleAssignment, FormType, PredefinedValue, User


class QMSLoginForm(AuthenticationForm):
    """Thin wrapper over Django's AuthenticationForm purely for WCAG-friendly labels/widgets."""

    username = forms.CharField(
        label=_("Username"),
        widget=forms.TextInput(attrs={"autofocus": True, "autocomplete": "username"}),
    )
    password = forms.CharField(
        label=_("Password"),
        strip=False,
        widget=forms.PasswordInput(attrs={"autocomplete": "current-password"}),
    )


class AdminUserForm(forms.ModelForm):
    """Used by the ADMINISTRATOR to create or edit a person's account."""

    password = forms.CharField(
        label=_("Temporary password"),
        widget=forms.PasswordInput,
        required=False,
        help_text=_("Leave blank when editing to keep the current password."),
    )

    class Meta:
        model = User
        fields = [
            "username",
            "first_name",
            "last_name",
            "email",
            "initials",
            "is_administrator",
            "is_active",
        ]
        widgets = {
            "username": forms.TextInput(attrs={"autocomplete": "off"}),
        }

    def save(self, commit=True):
        user = super().save(commit=False)
        raw_password = self.cleaned_data.get("password")
        if raw_password:
            user.set_password(raw_password)
            user.must_change_password = True
        if commit:
            user.save()
        return user


class FormRoleAssignmentForm(forms.ModelForm):
    class Meta:
        model = FormRoleAssignment
        fields = ["user", "form_type", "role", "is_active"]

    def clean(self):
        cleaned = super().clean()
        user = cleaned.get("user")
        form_type = cleaned.get("form_type")
        if user and form_type:
            qs = FormRoleAssignment.objects.filter(user=user, form_type=form_type)
            if self.instance.pk:
                qs = qs.exclude(pk=self.instance.pk)
            if qs.exists():
                raise forms.ValidationError(
                    _("%(user)s already has a role on %(form)s. Edit that assignment instead of adding a new one.")
                    % {"user": user, "form": form_type}
                )
        return cleaned


class PredefinedValueForm(forms.ModelForm):
    class Meta:
        model = PredefinedValue
        fields = ["form_type", "field_key", "value_en", "value_es", "is_active", "sort_order"]
