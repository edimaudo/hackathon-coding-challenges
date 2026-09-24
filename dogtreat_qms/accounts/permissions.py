"""
Central place for "who is allowed to do what" so every view checks
permissions the same way instead of re-deriving role logic ad hoc.
"""

from functools import wraps

from django.core.exceptions import PermissionDenied
from django.shortcuts import redirect

from .models import FormRoleAssignment


def get_role(user, form_type_code):
    """Return 'USER' / 'SUPERVISOR' / 'AUDITOR' / None for this user on this form."""
    if not user.is_authenticated:
        return None
    assignment = (
        FormRoleAssignment.objects.filter(
            user=user, form_type__code=form_type_code, is_active=True
        )
        .select_related("form_type")
        .first()
    )
    return assignment.role if assignment else None


def can_enter_data(user, form_type_code):
    return user.is_administrator or get_role(user, form_type_code) == FormRoleAssignment.ROLE_USER


def can_review(user, form_type_code):
    return user.is_administrator or get_role(user, form_type_code) == FormRoleAssignment.ROLE_SUPERVISOR


def can_view_only(user, form_type_code):
    role = get_role(user, form_type_code)
    return user.is_administrator or role in (
        FormRoleAssignment.ROLE_AUDITOR,
        FormRoleAssignment.ROLE_USER,
        FormRoleAssignment.ROLE_SUPERVISOR,
    )


def require_role(check_fn):
    """
    View decorator. The wrapped view must accept `form_type_code` as a kwarg
    (it does, via urls.py). Raises 403 rather than silently redirecting, since
    a role failure here is a genuine access-control event worth surfacing.
    """

    def decorator(view_func):
        @wraps(view_func)
        def wrapped(request, *args, **kwargs):
            if not request.user.is_authenticated:
                return redirect("accounts:login")
            form_type_code = kwargs.get("form_type_code")
            if not check_fn(request.user, form_type_code):
                raise PermissionDenied("You do not have the required role for this form.")
            return view_func(request, *args, **kwargs)

        return wrapped

    return decorator


def admin_required(view_func):
    @wraps(view_func)
    def wrapped(request, *args, **kwargs):
        if not request.user.is_authenticated:
            return redirect("accounts:login")
        if not request.user.is_administrator:
            raise PermissionDenied("Administrator access is required.")
        return view_func(request, *args, **kwargs)

    return wrapped
