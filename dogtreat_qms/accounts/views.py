from django.contrib import messages
from django.contrib.auth import views as auth_views
from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import PasswordChangeForm
from django.db.models import ProtectedError
from django.shortcuts import get_object_or_404, redirect, render
from django.urls import reverse_lazy
from django.utils.translation import gettext as _
from django.views import View

from .forms import AdminUserForm, FormRoleAssignmentForm, PredefinedValueForm, QMSLoginForm
from .models import FormRoleAssignment, FormType, PredefinedValue, User
from .permissions import admin_required


class QMSLoginView(auth_views.LoginView):
    template_name = "accounts/login.html"
    authentication_form = QMSLoginForm
    redirect_authenticated_user = True


class QMSLogoutView(auth_views.LogoutView):
    next_page = reverse_lazy("accounts:login")


@login_required
def force_password_change(request):
    if request.method == "POST":
        form = PasswordChangeForm(request.user, request.POST)
        if form.is_valid():
            user = form.save()
            user.must_change_password = False
            user.save(update_fields=["must_change_password"])
            from django.contrib.auth import update_session_auth_hash

            update_session_auth_hash(request, user)
            messages.success(request, _("Password updated."))
            return redirect("core:dashboard")
    else:
        form = PasswordChangeForm(request.user)
    return render(request, "accounts/force_password_change.html", {"form": form})


# ---------------------------------------------------------------------------
# Admin-only: user management
# ---------------------------------------------------------------------------

@admin_required
def user_list(request):
    users = User.objects.all().order_by("last_name", "first_name", "username")
    return render(request, "accounts/user_list.html", {"users": users})


@admin_required
def user_create(request):
    if request.method == "POST":
        form = AdminUserForm(request.POST)
        if form.is_valid():
            user = form.save()
            messages.success(request, _("Account created for %(u)s.") % {"u": user})
            return redirect("accounts:user_list")
    else:
        form = AdminUserForm()
    return render(request, "accounts/user_form.html", {"form": form, "creating": True})


@admin_required
def user_edit(request, user_id):
    user = get_object_or_404(User, pk=user_id)
    if request.method == "POST":
        form = AdminUserForm(request.POST, instance=user)
        if form.is_valid():
            form.save()
            messages.success(request, _("Account updated for %(u)s.") % {"u": user})
            return redirect("accounts:user_list")
    else:
        form = AdminUserForm(instance=user)
    return render(request, "accounts/user_form.html", {"form": form, "creating": False, "target_user": user})


@admin_required
def user_deactivate(request, user_id):
    user = get_object_or_404(User, pk=user_id)
    if request.method == "POST":
        user.is_active = False
        user.save(update_fields=["is_active"])
        messages.success(request, _("%(u)s deactivated. Their historical records are unaffected.") % {"u": user})
    return redirect("accounts:user_list")


@admin_required
def user_delete(request, user_id):
    """
    Real deletion is allowed only when the account has never signed or
    stamped a BRC record — otherwise we'd be erasing audit history, which
    would itself be a BRC nonconformance. In that case we ask the admin to
    deactivate instead.
    """
    user = get_object_or_404(User, pk=user_id)
    if request.method == "POST":
        try:
            username = str(user)
            user.delete()
            messages.success(request, _("%(u)s permanently deleted.") % {"u": username})
        except ProtectedError:
            messages.error(
                request,
                _(
                    "%(u)s has signed or reviewed existing BRC records, so deleting the account "
                    "would break the audit trail. Use Deactivate instead."
                )
                % {"u": user},
            )
    return redirect("accounts:user_list")


@admin_required
def role_matrix(request):
    if request.method == "POST":
        form = FormRoleAssignmentForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, _("Role assignment saved."))
            return redirect("accounts:role_matrix")
    else:
        form = FormRoleAssignmentForm()
    assignments = FormRoleAssignment.objects.select_related("user", "form_type").order_by(
        "form_type__sort_order", "role", "user__last_name"
    )
    return render(
        request,
        "accounts/role_matrix.html",
        {"form": form, "assignments": assignments},
    )


@admin_required
def role_assignment_remove(request, assignment_id):
    assignment = get_object_or_404(FormRoleAssignment, pk=assignment_id)
    if request.method == "POST":
        assignment.delete()
        messages.success(request, _("Role assignment removed."))
    return redirect("accounts:role_matrix")


@admin_required
def predefined_values(request):
    if request.method == "POST":
        form = PredefinedValueForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, _("Predefined value saved."))
            return redirect("accounts:predefined_values")
    else:
        form = PredefinedValueForm()
    values = PredefinedValue.objects.select_related("form_type").all()
    return render(request, "accounts/predefined_values.html", {"form": form, "values": values})


@admin_required
def predefined_value_toggle(request, value_id):
    value = get_object_or_404(PredefinedValue, pk=value_id)
    if request.method == "POST":
        value.is_active = not value.is_active
        value.save(update_fields=["is_active"])
    return redirect("accounts:predefined_values")
