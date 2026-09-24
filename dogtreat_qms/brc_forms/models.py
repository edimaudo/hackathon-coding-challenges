from decimal import Decimal

from django.conf import settings
from django.contrib.contenttypes.fields import GenericRelation
from django.contrib.contenttypes.models import ContentType
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _

User = settings.AUTH_USER_MODEL


class FormRecordStatus(models.TextChoices):
    """
    The three-state lifecycle described in the spec:
    OPEN        -> a USER can still enter/edit values.
    COMPLETED   -> USER has finished; user+date stamped; locked from further
                   USER edits; now waiting on a SUPERVISOR.
    REVIEWED    -> SUPERVISOR has approved; user+date stamped; the record is
                   final and only ever read from here on (audits, reprints).
    """

    OPEN = "OPEN", _("Open")
    COMPLETED = "COMPLETED", _("Completed")
    REVIEWED = "REVIEWED", _("Reviewed")


class FormRecordBase(models.Model):
    """
    Shared audit/workflow fields every BRC record needs. Concrete models
    (one per form type) inherit this instead of re-declaring the same six
    columns thirteen times.
    """

    status = models.CharField(max_length=12, choices=FormRecordStatus.choices, default=FormRecordStatus.OPEN)
    record_date = models.DateField(_("record date"), default=timezone.localdate)

    created_by = models.ForeignKey(User, on_delete=models.PROTECT, related_name="+")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    completed_by = models.ForeignKey(User, on_delete=models.PROTECT, null=True, blank=True, related_name="+")
    completed_at = models.DateTimeField(null=True, blank=True)

    reviewed_by = models.ForeignKey(User, on_delete=models.PROTECT, null=True, blank=True, related_name="+")
    reviewed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        abstract = True
        ordering = ["-record_date", "-id"]

    @property
    def is_open(self):
        return self.status == FormRecordStatus.OPEN

    @property
    def is_locked_from_user_edits(self):
        return self.status != FormRecordStatus.OPEN

    def mark_completed(self, user):
        self.status = FormRecordStatus.COMPLETED
        self.completed_by = user
        self.completed_at = timezone.now()

    def mark_reviewed(self, user):
        self.status = FormRecordStatus.REVIEWED
        self.reviewed_by = user
        self.reviewed_at = timezone.now()


class FieldNote(models.Model):
    """
    A supervisor's note attached to one specific field of one specific
    record, of any form type — generic so we don't need a notes table per
    form. Supervisors can only ever add notes; they never touch the
    original value the USER entered.
    """

    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    field_name = models.CharField(max_length=100, help_text="Which field on the record this note refers to.")
    note_text = models.TextField()
    created_by = models.ForeignKey(User, on_delete=models.PROTECT, related_name="+")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["created_at"]

    def __str__(self):
        return f"Note on {self.field_name} by {self.created_by}"


class CookedProductionYieldLog(FormRecordBase):
    """
    Modeled directly on the plant's paper "Cooked Production Yield Log":
    header identifiers + dates, a packaging table, combo/consumables
    counts, waste/yield, and an employee task/time table. This is the
    #1 highest-priority BRC form (primary traceability documentation).
    """

    type_of_product = models.CharField(_("type of product"), max_length=150)
    raw_lot_number = models.CharField(_("raw lot number"), max_length=100)
    finished_lot_number = models.CharField(_("finished lot number"), max_length=100)

    date_out_of_oven = models.DateField(_("date out of oven"), default=timezone.localdate)
    date_packaged = models.DateField(_("date packaged"), default=timezone.localdate)

    date_in_hot_room = models.DateField(_("date in hot room"), null=True, blank=True)
    date_in_hot_room_na = models.BooleanField(_("N/A"), default=False)
    date_out_hot_room = models.DateField(_("date out hot room"), null=True, blank=True)
    date_out_hot_room_na = models.BooleanField(_("N/A"), default=False)

    combos_used = models.PositiveIntegerField(_("combos used"), default=0)
    combo_lids_used = models.PositiveIntegerField(_("combo lids used"), default=0)
    combo_liners_used = models.PositiveIntegerField(_("combo liners used"), default=0)
    labels_used = models.PositiveIntegerField(_("labels used"), default=0)
    boxes_used = models.PositiveIntegerField(_("boxes used"), default=0)
    box_liners_used = models.PositiveIntegerField(_("box liners used"), default=0)

    waste_weight_lbs = models.DecimalField(_("waste weight (lbs)"), max_digits=8, decimal_places=2, default=Decimal("0"))
    yield_percent = models.DecimalField(
        _("yield %"), max_digits=6, decimal_places=2, null=True, blank=True,
        help_text=_("Entered/confirmed by the user; verified by the supervisor on review."),
    )

    notes = models.TextField(_("notes"), blank=True, help_text=_("Open narrative — anything not captured above."))

    field_notes = GenericRelation(FieldNote, content_type_field="content_type", object_id_field="object_id")

    class Meta(FormRecordBase.Meta):
        verbose_name = _("Cooked Production Yield Log")
        verbose_name_plural = _("Cooked Production Yield Logs")

    def __str__(self):
        return f"Cooked Yield Log #{self.pk} — {self.finished_lot_number} ({self.record_date})"

    @property
    def total_finished_weight(self):
        return self.packaging_lines.aggregate(total=models.Sum("weight"))["total"] or Decimal("0")

    @property
    def total_time_hours(self):
        return self.employee_tasks.aggregate(total=models.Sum("time_to_complete_hours"))["total"] or Decimal("0")


class PackagingLine(models.Model):
    """One row of the packaging table (lot/size/weight/piece count)."""

    yield_log = models.ForeignKey(CookedProductionYieldLog, on_delete=models.CASCADE, related_name="packaging_lines")
    lot_description = models.CharField(_("packaging description"), max_length=100)
    size_description = models.CharField(_("size"), max_length=150)
    weight = models.DecimalField(_("weight (lbs)"), max_digits=8, decimal_places=2)
    piece_count = models.PositiveIntegerField(_("piece count"), null=True, blank=True)
    piece_count_na = models.BooleanField(_("N/A"), default=False)
    sort_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["sort_order", "id"]


class EmployeeTaskLine(models.Model):
    """One row of the employee/task/time table."""

    yield_log = models.ForeignKey(CookedProductionYieldLog, on_delete=models.CASCADE, related_name="employee_tasks")
    employee_initials = models.CharField(_("initials"), max_length=6)
    task = models.CharField(_("task"), max_length=150)
    time_to_complete_hours = models.DecimalField(_("time to complete (hours)"), max_digits=6, decimal_places=2)
    sort_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["sort_order", "id"]
