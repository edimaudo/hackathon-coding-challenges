from django.shortcuts import redirect
from django.urls import reverse

EXEMPT_URL_NAMES = {"accounts:force_password_change", "accounts:logout"}


class ForcePasswordChangeMiddleware:
    """Redirects anyone still on a default password to the change-password screen."""

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        user = getattr(request, "user", None)
        if (
            user
            and user.is_authenticated
            and getattr(user, "must_change_password", False)
            and not request.path.startswith("/static/")
        ):
            exempt_paths = {reverse(name) for name in EXEMPT_URL_NAMES}
            if request.path not in exempt_paths:
                return redirect("accounts:force_password_change")
        return self.get_response(request)
