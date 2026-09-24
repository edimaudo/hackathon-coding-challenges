from django.conf import settings
from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("admin/", admin.site.urls),
    path("i18n/", include("django.conf.urls.i18n")),  # POST target for the language switcher
    path("accounts/", include("accounts.urls")),
    path("forms/", include("brc_forms.urls")),
    path("", include("core.urls")),
]

if settings.DEBUG:
    from django.conf.urls.static import static

    urlpatterns += static(settings.STATIC_URL, document_root=settings.BASE_DIR / "static")
