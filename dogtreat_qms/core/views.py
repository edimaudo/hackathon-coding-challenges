from django.contrib.auth.decorators import login_required
from django.shortcuts import render

from accounts.models import FormRoleAssignment, FormType


@login_required
def dashboard(request):
    user = request.user
    language = request.LANGUAGE_CODE

    if user.is_administrator:
        my_assignments = {}
    else:
        my_assignments = {
            a.form_type_id: a.role
            for a in FormRoleAssignment.objects.filter(user=user, is_active=True)
        }

    rows = []
    for form_type in FormType.objects.all():
        role = "ADMIN" if user.is_administrator else my_assignments.get(form_type.id)
        if role is None:
            continue  # not assigned to this form at all — don't clutter the dashboard
        rows.append(
            {
                "form_type": form_type,
                "name": form_type.display_name(language),
                "role": role,
                "url_name": form_type.url_name,
            }
        )

    return render(
        request,
        "core/dashboard.html",
        {"rows": rows, "is_administrator": user.is_administrator},
    )
