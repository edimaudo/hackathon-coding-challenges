from django.urls import path

from . import views

app_name = "brc_forms"

urlpatterns = [
    path("cooked-yield/", views.yield_log_list, name="cooked_yield_list"),
    path("cooked-yield/new/", views.yield_log_create, name="yield_log_create"),
    path("cooked-yield/print/", views.yield_log_print_batch, name="yield_log_print_batch"),
    path("cooked-yield/<int:pk>/", views.yield_log_detail, name="yield_log_detail"),
    path("cooked-yield/<int:pk>/edit/", views.yield_log_edit, name="yield_log_edit"),
    path("cooked-yield/<int:pk>/review/", views.yield_log_review, name="yield_log_review"),
    path("cooked-yield/<int:pk>/print/", views.yield_log_print, name="yield_log_print"),
]
