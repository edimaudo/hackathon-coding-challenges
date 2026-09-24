from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.contrib.contenttypes.models import ContentType
from django.core.exceptions import PermissionDenied
from django.shortcuts import get_object_or_404, redirect, render
from django.utils.translation import gettext as _

from accounts.permissions import can_enter_data, can_review, can_view_only

from .forms import (
    CookedYieldForm, EmployeeTaskLineFormSet, PackagingLineFormSet, RecordSearchForm,
)
from .models import CookedProductionYieldLog, FieldNote, FormRecordStatus

FORM_TYPE_CODE = "cooked-yield"

# Which model fields a supervisor is allowed to attach a review note to.
# Kept explicit (rather than "any field") so a note can't be filed against
# something that isn't actually shown on the form.
NOTEABLE_FIELDS = [
    "type_of_product", "raw_lot_number", "finished_lot_number",
    "date_out_of_oven", "date_packaged", "date_in_hot_room", "date_out_hot_room",
    "combos_used", "combo_lids_used", "combo_liners_used", "labels_used",
    "boxes_used", "box_liners_used", "waste_weight_lbs", "yield_percent",
    "packaging_lines", "employee_tasks", "notes",
]


def _guard_view_access(user):
    if not can_view_only(user, FORM_TYPE_CODE):
        raise PermissionDenied(_("You are not assigned a role on the Cooked Production Yield Log."))


@login_required
def yield_log_list(request):
    _guard_view_access(request.user)
    search_form = RecordSearchForm(request.GET or None)
    records = CookedProductionYieldLog.objects.all()

    if search_form.is_valid():
        data = search_form.cleaned_data
        if data.get("date_from"):
            records = records.filter(record_date__gte=data["date_from"])
        if data.get("date_to"):
            records = records.filter(record_date__lte=data["date_to"])
        if data.get("lot_number"):
            records = records.filter(finished_lot_number__icontains=data["lot_number"])
        if data.get("status"):
            records = records.filter(status=data["status"])

    return render(
        request,
        "brc_forms/yield_log_list.html",
        {
            "records": records[:200],
            "search_form": search_form,
            "can_enter": can_enter_data(request.user, FORM_TYPE_CODE),
        },
    )


@login_required
def yield_log_create(request):
    if not can_enter_data(request.user, FORM_TYPE_CODE):
        raise PermissionDenied(_("Only a User assigned to this form can create a new record."))

    if request.method == "POST":
        form = CookedYieldForm(request.POST)
        if form.is_valid():
            instance = form.save(commit=False)
            instance.created_by = request.user
            instance.save()
            packaging_fs = PackagingLineFormSet(request.POST, instance=instance)
            employee_fs = EmployeeTaskLineFormSet(request.POST, instance=instance)
            if packaging_fs.is_valid() and employee_fs.is_valid():
                packaging_fs.save()
                employee_fs.save()
                messages.success(request, _("Record saved as OPEN. Complete it once all fields are ready."))
                return redirect("brc_forms:yield_log_edit", pk=instance.pk)
        else:
            packaging_fs = PackagingLineFormSet(request.POST)
            employee_fs = EmployeeTaskLineFormSet(request.POST)
    else:
        form = CookedYieldForm()
        packaging_fs = PackagingLineFormSet()
        employee_fs = EmployeeTaskLineFormSet()

    return render(
        request,
        "brc_forms/yield_log_form.html",
        {"form": form, "packaging_fs": packaging_fs, "employee_fs": employee_fs, "record": None},
    )


@login_required
def yield_log_edit(request, pk):
    record = get_object_or_404(CookedProductionYieldLog, pk=pk)
    if not can_enter_data(request.user, FORM_TYPE_CODE):
        raise PermissionDenied(_("Only a User assigned to this form can edit it."))
    if record.is_locked_from_user_edits:
        messages.warning(request, _("This record is %(status)s and can no longer be edited by a User.") % {"status": record.get_status_display()})
        return redirect("brc_forms:yield_log_detail", pk=pk)

    if request.method == "POST":
        form = CookedYieldForm(request.POST, instance=record)
        packaging_fs = PackagingLineFormSet(request.POST, instance=record)
        employee_fs = EmployeeTaskLineFormSet(request.POST, instance=record)
        if form.is_valid() and packaging_fs.is_valid() and employee_fs.is_valid():
            form.save()
            packaging_fs.save()
            employee_fs.save()
            if "complete" in request.POST:
                record.mark_completed(request.user)
                record.save()
                messages.success(request, _("Record marked COMPLETED and stamped with your name and today's date."))
                return redirect("brc_forms:yield_log_detail", pk=pk)
            messages.success(request, _("Draft saved."))
            return redirect("brc_forms:yield_log_edit", pk=pk)
    else:
        form = CookedYieldForm(instance=record)
        packaging_fs = PackagingLineFormSet(instance=record)
        employee_fs = EmployeeTaskLineFormSet(instance=record)

    return render(
        request,
        "brc_forms/yield_log_form.html",
        {"form": form, "packaging_fs": packaging_fs, "employee_fs": employee_fs, "record": record},
    )


@login_required
def yield_log_detail(request, pk):
    _guard_view_access(request.user)
    record = get_object_or_404(CookedProductionYieldLog, pk=pk)
    notes_by_field = {}
    for note in record.field_notes.select_related("created_by"):
        notes_by_field.setdefault(note.field_name, []).append(note)

    return render(
        request,
        "brc_forms/yield_log_detail.html",
        {
            "record": record,
            "notes_by_field": notes_by_field,
            "can_review": can_review(request.user, FORM_TYPE_CODE),
        },
    )


def _yield_log_field_labels_and_values(record):
    """Human labels + rendered values for every noteable field, in display order."""
    model_fields = {f.name: f for f in CookedProductionYieldLog._meta.get_fields() if hasattr(f, "verbose_name")}
    labels, values = [], {}
    for name in NOTEABLE_FIELDS:
        if name == "packaging_lines":
            labels.append((name, _("Packaging")))
            lines = record.packaging_lines.all()
            values[name] = "; ".join(f"{l.lot_description} / {l.size_description} / {l.weight} lbs" for l in lines) or "—"
        elif name == "employee_tasks":
            labels.append((name, _("Employees & tasks")))
            lines = record.employee_tasks.all()
            values[name] = "; ".join(f"{l.employee_initials} — {l.task} ({l.time_to_complete_hours} hrs)" for l in lines) or "—"
        elif name in ("date_in_hot_room", "date_out_hot_room"):
            na_attr = f"{name}_na"
            labels.append((name, model_fields[name].verbose_name))
            values[name] = _("N/A") if getattr(record, na_attr) else getattr(record, name)
        else:
            field = model_fields.get(name)
            label = field.verbose_name if field else name
            labels.append((name, label))
            value = getattr(record, name)
            values[name] = value if value not in (None, "") else "—"
    return labels, values


@login_required
def yield_log_review(request, pk):
    record = get_object_or_404(CookedProductionYieldLog, pk=pk)
    if not can_review(request.user, FORM_TYPE_CODE):
        raise PermissionDenied(_("Only a Supervisor assigned to this form can review it."))
    if record.status == FormRecordStatus.OPEN:
        messages.warning(request, _("This record is still OPEN — it has not been completed by a User yet."))
        return redirect("brc_forms:yield_log_detail", pk=pk)

    content_type = ContentType.objects.get_for_model(CookedProductionYieldLog)
    notes_by_field = {}
    for note in record.field_notes.select_related("created_by"):
        notes_by_field.setdefault(note.field_name, []).append(note)

    if request.method == "POST":
        for field_name in NOTEABLE_FIELDS:
            text = request.POST.get(f"note__{field_name}", "").strip()
            if text:
                FieldNote.objects.create(
                    content_type=content_type, object_id=record.pk,
                    field_name=field_name, note_text=text, created_by=request.user,
                )
        if "mark_reviewed" in request.POST:
            record.mark_reviewed(request.user)
            record.save()
            messages.success(request, _("Record marked REVIEWED and stamped with your name and today's date."))
            return redirect("brc_forms:yield_log_detail", pk=pk)
        messages.success(request, _("Notes saved."))
        return redirect("brc_forms:yield_log_review", pk=pk)

    field_labels, field_values = _yield_log_field_labels_and_values(record)
    return render(
        request,
        "brc_forms/yield_log_review.html",
        {
            "record": record,
            "notes_by_field": notes_by_field,
            "field_labels": field_labels,
            "field_values": field_values,
        },
    )


@login_required
def yield_log_print(request, pk):
    _guard_view_access(request.user)
    record = get_object_or_404(CookedProductionYieldLog, pk=pk)
    return render(request, "brc_forms/yield_log_print.html", {"records": [record]})


@login_required
def yield_log_print_batch(request):
    _guard_view_access(request.user)
    ids = request.GET.getlist("id")
    records = CookedProductionYieldLog.objects.filter(pk__in=ids)
    return render(request, "brc_forms/yield_log_print.html", {"records": records})
