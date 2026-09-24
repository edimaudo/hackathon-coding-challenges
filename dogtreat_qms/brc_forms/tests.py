from django.core.management import call_command
from django.test import Client, TestCase

from accounts.models import PredefinedValue, User
from brc_forms.models import CookedProductionYieldLog, FieldNote

VALID_POST_DATA = {
    "record_date": "2026-09-20",
    "type_of_product": "Lamb Lung",
    "raw_lot_number": "WOLV5160018013",
    "finished_lot_number": "160118040",
    "date_out_of_oven": "2026-09-20",
    "date_packaged": "2026-09-20",
    "date_in_hot_room_combined_0": "", "date_in_hot_room_combined_1": "on",
    "date_out_hot_room_combined_0": "", "date_out_hot_room_combined_1": "on",
    "combos_used": 2, "combo_lids_used": 2, "combo_liners_used": 2,
    "labels_used": 6, "boxes_used": 8, "box_liners_used": 8,
    "waste_weight_lbs": "7", "yield_percent": "",
    "notes": "Test record.",
    "packaging_lines-TOTAL_FORMS": "2", "packaging_lines-INITIAL_FORMS": "0",
    "packaging_lines-MIN_NUM_FORMS": "0", "packaging_lines-MAX_NUM_FORMS": "1000",
    "packaging_lines-0-lot_description": "160118040", "packaging_lines-0-size_description": "Lamb Lung",
    "packaging_lines-0-weight": "160", "packaging_lines-0-piece_count": "", "packaging_lines-0-piece_count_na": "on",
    "packaging_lines-0-sort_order": "0",
    "packaging_lines-1-lot_description": "160118040", "packaging_lines-1-size_description": "Lamb Lung",
    "packaging_lines-1-weight": "131", "packaging_lines-1-piece_count": "", "packaging_lines-1-piece_count_na": "on",
    "packaging_lines-1-sort_order": "1",
    "employee_tasks-TOTAL_FORMS": "2", "employee_tasks-INITIAL_FORMS": "0",
    "employee_tasks-MIN_NUM_FORMS": "0", "employee_tasks-MAX_NUM_FORMS": "1000",
    "employee_tasks-0-employee_initials": "AJ", "employee_tasks-0-task": "Unload oven",
    "employee_tasks-0-time_to_complete_hours": "0.75", "employee_tasks-0-sort_order": "0",
    "employee_tasks-1-employee_initials": "AJ", "employee_tasks-1-task": "Weigh",
    "employee_tasks-1-time_to_complete_hours": "0.50", "employee_tasks-1-sort_order": "1",
}


class CookedYieldLogWorkflowTests(TestCase):
    def setUp(self):
        call_command("seed_data")
        self.admin = Client()
        self.user_a = Client()
        self.supervisor = Client()
        self.auditor = Client()
        self._login(self.admin, "admin1", "Admin#2024!", "N3wAdminPass!23")
        self._login(self.user_a, "usera", "User#2024!", "N3wUserPass!23")
        self._login(self.supervisor, "supervisor1", "Super#2024!", "N3wSuperPass!23")
        self._login(self.auditor, "auditor1", "Audit#2024!", "N3wAuditPass!23")

    def _login(self, client, username, default_password, new_password):
        client.post("/accounts/login/", {"username": username, "password": default_password})
        client.post("/accounts/password/change/", {
            "old_password": default_password, "new_password1": new_password, "new_password2": new_password,
        })

    def test_full_lifecycle_and_permissions(self):
        response = self.user_a.post("/forms/cooked-yield/new/", VALID_POST_DATA, follow=True)
        self.assertEqual(response.status_code, 200)

        record = CookedProductionYieldLog.objects.latest("id")
        self.assertEqual(record.packaging_lines.count(), 2)
        self.assertEqual(record.employee_tasks.count(), 2)
        self.assertEqual(record.total_finished_weight, 291)
        self.assertEqual(record.status, "OPEN")

        # Auditor is read-only: can list/view but not edit or review
        self.assertEqual(self.auditor.get("/forms/cooked-yield/").status_code, 200)
        self.assertEqual(self.auditor.get(f"/forms/cooked-yield/{record.pk}/edit/").status_code, 403)
        self.assertEqual(self.auditor.get(f"/forms/cooked-yield/{record.pk}/review/").status_code, 403)

        # Supervisor cannot review a record that's still OPEN
        response = self.supervisor.get(f"/forms/cooked-yield/{record.pk}/review/", follow=True)
        self.assertIn(b"still OPEN", response.content)

        # USER completes the record -> stamped, locked from further USER edits
        self.user_a.post(f"/forms/cooked-yield/{record.pk}/edit/", {**VALID_POST_DATA, "complete": "1"}, follow=True)
        record.refresh_from_db()
        self.assertEqual(record.status, "COMPLETED")
        self.assertEqual(record.completed_by.username, "usera")
        self.assertIsNotNone(record.completed_at)

        response = self.user_a.get(f"/forms/cooked-yield/{record.pk}/edit/", follow=True)
        self.assertIn(b"can no longer be edited", response.content)

        # Supervisor adds a field note and marks it REVIEWED
        self.supervisor.post(f"/forms/cooked-yield/{record.pk}/review/", {
            "note__waste_weight_lbs": "Confirmed against scale log.",
            "mark_reviewed": "1",
        }, follow=True)
        record.refresh_from_db()
        self.assertEqual(record.status, "REVIEWED")
        self.assertEqual(record.reviewed_by.username, "supervisor1")
        self.assertTrue(FieldNote.objects.filter(field_name="waste_weight_lbs").exists())

        response = self.supervisor.get(f"/forms/cooked-yield/{record.pk}/")
        self.assertIn(b"Confirmed against scale log", response.content)

        self.assertEqual(self.supervisor.get(f"/forms/cooked-yield/{record.pk}/print/").status_code, 200)

        response = self.supervisor.get("/forms/cooked-yield/?lot_number=160118040")
        self.assertIn(record.finished_lot_number.encode(), response.content)

    def test_one_role_per_user_per_form_is_enforced(self):
        from accounts.models import FormRoleAssignment, FormType
        form_type = FormType.objects.get(code="cooked-yield")
        user_a = User.objects.get(username="usera")
        with self.assertRaises(Exception):
            FormRoleAssignment.objects.create(user=user_a, form_type=form_type, role="SUPERVISOR")

    def test_admin_can_deactivate_predefined_value_and_it_disappears_from_new_forms(self):
        # "Sweet Potato Chew" legitimately appears twice on the new-record page:
        # once in the Type of Product dropdown (field_key="product_type") and
        # once in the per-line Size dropdown (field_key="packaging_size") —
        # these are deliberately separate PredefinedValue rows. Deactivating
        # the product_type one should remove exactly that one occurrence.
        # Each dropdown option renders the value twice (value="..." and the
        # visible text), so "Sweet Potato Chew" appears twice per dropdown:
        # once in Type of Product (product_type) and once in the line-item
        # Size dropdown (packaging_size) — 4 occurrences total to start.
        before = self.user_a.get("/forms/cooked-yield/new/").content.count(b"Sweet Potato Chew")
        self.assertEqual(before, 4)

        pv = PredefinedValue.objects.get(
            form_type__code="cooked-yield", field_key="product_type", value_en="Sweet Potato Chew"
        )
        self.admin.post(f"/accounts/predefined-values/{pv.id}/toggle/")
        pv.refresh_from_db()
        self.assertFalse(pv.is_active)

        after = self.user_a.get("/forms/cooked-yield/new/").content.count(b"Sweet Potato Chew")
        self.assertEqual(after, 2)

    def test_language_switch(self):
        response = self.admin.post("/i18n/setlang/", {"language": "es", "next": "/"}, follow=True)
        self.assertEqual(response.status_code, 200)
