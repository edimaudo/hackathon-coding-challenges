from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import FormRoleAssignment, FormType, PredefinedValue, User


@admin.register(User)
class QMSUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (
        ("BRC QMS", {"fields": ("initials", "is_administrator", "must_change_password")}),
    )
    list_display = ("username", "first_name", "last_name", "is_administrator", "is_active")


@admin.register(FormType)
class FormTypeAdmin(admin.ModelAdmin):
    list_display = ("name_en", "code", "priority", "is_implemented", "sort_order")
    list_editable = ("sort_order", "is_implemented")


@admin.register(FormRoleAssignment)
class FormRoleAssignmentAdmin(admin.ModelAdmin):
    list_display = ("user", "form_type", "role", "is_active")
    list_filter = ("form_type", "role", "is_active")


@admin.register(PredefinedValue)
class PredefinedValueAdmin(admin.ModelAdmin):
    list_display = ("form_type", "field_key", "value_en", "is_active", "sort_order")
    list_filter = ("form_type", "field_key", "is_active")
