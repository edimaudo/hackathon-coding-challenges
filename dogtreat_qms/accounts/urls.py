from django.urls import path

from . import views

app_name = "accounts"

urlpatterns = [
    path("login/", views.QMSLoginView.as_view(), name="login"),
    path("logout/", views.QMSLogoutView.as_view(), name="logout"),
    path("password/change/", views.force_password_change, name="force_password_change"),
    path("users/", views.user_list, name="user_list"),
    path("users/new/", views.user_create, name="user_create"),
    path("users/<int:user_id>/edit/", views.user_edit, name="user_edit"),
    path("users/<int:user_id>/deactivate/", views.user_deactivate, name="user_deactivate"),
    path("users/<int:user_id>/delete/", views.user_delete, name="user_delete"),
    path("roles/", views.role_matrix, name="role_matrix"),
    path("roles/<int:assignment_id>/remove/", views.role_assignment_remove, name="role_assignment_remove"),
    path("predefined-values/", views.predefined_values, name="predefined_values"),
    path("predefined-values/<int:value_id>/toggle/", views.predefined_value_toggle, name="predefined_value_toggle"),
]
