from django.contrib import admin

from .models import CookedProductionYieldLog, EmployeeTaskLine, FieldNote, PackagingLine


class PackagingLineInline(admin.TabularInline):
    model = PackagingLine
    extra = 0


class EmployeeTaskLineInline(admin.TabularInline):
    model = EmployeeTaskLine
    extra = 0


@admin.register(CookedProductionYieldLog)
class CookedProductionYieldLogAdmin(admin.ModelAdmin):
    list_display = ("id", "record_date", "finished_lot_number", "status", "created_by", "reviewed_by")
    list_filter = ("status", "record_date")
    inlines = [PackagingLineInline, EmployeeTaskLineInline]


@admin.register(FieldNote)
class FieldNoteAdmin(admin.ModelAdmin):
    list_display = ("field_name", "content_type", "object_id", "created_by", "created_at")
