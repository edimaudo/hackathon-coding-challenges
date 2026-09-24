class PreferencesMiddleware:
    """
    Reads the qms_theme and qms_font_scale cookies (set client-side by
    static/js/preferences.js) so templates can render the right
    data-theme / data-font-scale attributes on first paint, with no flash
    of the wrong theme. Falls back to documented defaults: light + medium.
    """

    VALID_THEMES = {"light", "dark"}
    VALID_SCALES = {"small", "medium", "large"}

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        theme = request.COOKIES.get("qms_theme", "light")
        scale = request.COOKIES.get("qms_font_scale", "medium")
        request.ui_theme = theme if theme in self.VALID_THEMES else "light"
        request.ui_font_scale = scale if scale in self.VALID_SCALES else "medium"
        return self.get_response(request)
