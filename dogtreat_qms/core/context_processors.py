def ui_preferences(request):
    return {
        "ui_theme": getattr(request, "ui_theme", "light"),
        "ui_font_scale": getattr(request, "ui_font_scale", "medium"),
    }
