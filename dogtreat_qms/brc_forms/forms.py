from django import forms
from django.forms import inlineformset_factory
from django.utils.translation import get_language, gettext_lazy as _

from accounts.models import PredefinedValue

from .models import CookedProductionYieldLog, EmployeeTaskLine, PackagingLine


def predefined_choices(form_type_code, field_key, language=None):
    """Live dropdown choices from PredefinedValue, active only, admin-managed."""
    language = language or get_language()
    qs = PredefinedValue.objects.filter(form_type__code=form_type_code, field_key=field_key, is_active=True)
    choices = [("", _("— Select —"))]
    choices += [(v.value_en, v.display_value(language)) for v in qs]
    return choices


class DateOrNAWidget(forms.MultiWidget):
    """Pairs a date input with an N/A checkbox — the Yes/No/N/A-style field the spec calls for on dates."""

    def __init__(self, attrs=None):
        widgets = [forms.DateInput(attrs={"type": "date"}), forms.CheckboxInput()]
        super().__init__(widgets, attrs)

    def decompress(self, value):
        return [value, False] if value else [None, False]


class DateOrNAField(forms.MultiValueField):
    def __init__(self, **kwargs):
        fields = (forms.DateField(required=False), forms.BooleanField(required=False))
        super().__init__(fields=fields, widget=DateOrNAWidget(), require_all_fields=False, **kwargs)

    def compress(self, data_list):
        if not data_list:
            return None
        date_value, is_na = data_list
        return None if is_na else date_value


class CookedYieldForm(forms.ModelForm):
    date_in_hot_room_combined = DateOrNAField(label=_("Date in hot room"), required=False)
    date_out_hot_room_combined = DateOrNAField(label=_("Date out hot room"), required=False)

    class Meta:
        model = CookedProductionYieldLog
        fields = [
            "record_date", "type_of_product", "raw_lot_number", "finished_lot_number",
            "date_out_of_oven", "date_packaged",
            "combos_used", "combo_lids_used", "combo_liners_used",
            "labels_used", "boxes_used", "box_liners_used",
            "waste_weight_lbs", "yield_percent", "notes",
        ]
        widgets = {
            "record_date": forms.DateInput(attrs={"type": "date"}),
            "date_out_of_oven": forms.DateInput(attrs={"type": "date"}),
            "date_packaged": forms.DateInput(attrs={"type": "date"}),
            "notes": forms.Textarea(attrs={"rows": 3}),
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields["type_of_product"] = forms.ChoiceField(
            label=_("Type of product"), choices=predefined_choices("cooked-yield", "product_type")
        )
        if self.instance and self.instance.pk:
            self.fields["date_in_hot_room_combined"].initial = [
                self.instance.date_in_hot_room, self.instance.date_in_hot_room_na
            ]
            self.fields["date_out_hot_room_combined"].initial = [
                self.instance.date_out_hot_room, self.instance.date_out_hot_room_na
            ]
        # required/non-required per spec: waste weight & yield can be genuinely
        # unknown until QA reviews, so leave yield_percent optional.
        self.fields["yield_percent"].required = False

    def clean(self):
        cleaned = super().clean()
        oven = cleaned.get("date_out_of_oven")
        packaged = cleaned.get("date_packaged")
        if oven and packaged and packaged < oven:
            self.add_error("date_packaged", _("Date packaged cannot be before the date out of the oven."))
        return cleaned

    def save(self, commit=True):
        instance = super().save(commit=False)
        hot_in = self.cleaned_data.get("date_in_hot_room_combined")
        hot_out = self.cleaned_data.get("date_out_hot_room_combined")
        instance.date_in_hot_room_na = hot_in is None
        instance.date_in_hot_room = hot_in
        instance.date_out_hot_room_na = hot_out is None
        instance.date_out_hot_room = hot_out
        if commit:
            instance.save()
        return instance


class PackagingLineForm(forms.ModelForm):
    class Meta:
        model = PackagingLine
        fields = ["lot_description", "size_description", "weight", "piece_count", "piece_count_na", "sort_order"]
        widgets = {"sort_order": forms.HiddenInput()}

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields["size_description"] = forms.ChoiceField(
            label=_("Size"), choices=predefined_choices("cooked-yield", "packaging_size"), required=True
        )

    def clean(self):
        cleaned = super().clean()
        if cleaned.get("weight") is not None and cleaned["weight"] < 0:
            self.add_error("weight", _("Weight cannot be negative."))
        return cleaned


class EmployeeTaskLineForm(forms.ModelForm):
    class Meta:
        model = EmployeeTaskLine
        fields = ["employee_initials", "task", "time_to_complete_hours", "sort_order"]
        widgets = {"sort_order": forms.HiddenInput()}

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields["task"] = forms.ChoiceField(
            label=_("Task"), choices=predefined_choices("cooked-yield", "yield_log_task"), required=True
        )


PackagingLineFormSet = inlineformset_factory(
    CookedProductionYieldLog, PackagingLine, form=PackagingLineForm, extra=1, can_delete=True,
)

EmployeeTaskLineFormSet = inlineformset_factory(
    CookedProductionYieldLog, EmployeeTaskLine, form=EmployeeTaskLineForm, extra=1, can_delete=True,
)


class FieldNoteForm(forms.Form):
    field_name = forms.CharField(widget=forms.HiddenInput())
    note_text = forms.CharField(widget=forms.Textarea(attrs={"rows": 2}), required=False, label=_("Supervisor note"))


class RecordSearchForm(forms.Form):
    date_from = forms.DateField(required=False, widget=forms.DateInput(attrs={"type": "date"}), label=_("From"))
    date_to = forms.DateField(required=False, widget=forms.DateInput(attrs={"type": "date"}), label=_("To"))
    lot_number = forms.CharField(required=False, label=_("Lot number contains"))
    status = forms.ChoiceField(
        required=False,
        choices=[("", _("Any status"))] + [
            ("OPEN", _("Open")), ("COMPLETED", _("Completed")), ("REVIEWED", _("Reviewed"))
        ],
    )
