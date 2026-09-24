from django.core.management.base import BaseCommand
from django.db import transaction

from accounts.models import FormRoleAssignment, FormType, PredefinedValue, User

# Every BRC record the plant runs. Only "cooked-yield" ships with real data-entry
# screens in this build; the rest are registered so roles/permissions/dashboard
# already reflect the full program and the remaining screens can be added form
# by form without touching this framework.
FORM_TYPES = [
    # code, English name, Spanish name, priority, is_implemented, url_name
    ("cooked-yield", "Cooked Production Yield Log", "Registro de Rendimiento de Producción Cocida", "HIGH", True, "brc_forms:cooked_yield_list"),
    ("raw-yield", "Raw Production Yield Log", "Registro de Rendimiento de Producción Cruda", "HIGH", False, ""),
    ("ambient-temp", "Ambient Temperature Monitoring Log", "Registro de Monitoreo de Temperatura Ambiente", "HIGH", False, ""),
    ("pre-op-cooked-side", "Pre-Operational Inspection – Cooked Side", "Inspección Preoperacional – Lado Cocido", "HIGH", False, ""),
    ("pre-op-dock", "Pre-Operational Inspection – Dock", "Inspección Preoperacional – Muelle", "HIGH", False, ""),
    ("pre-op-oven-room", "Pre-Operational Inspection – Oven Room", "Inspección Preoperacional – Sala de Hornos", "HIGH", False, ""),
    ("pre-op-hot-room", "Pre-Operational Inspection – Hot Room", "Inspección Preoperacional – Sala Caliente", "HIGH", False, ""),
    ("pre-op-raw-room", "Pre-Operational Inspection – Raw Room", "Inspección Preoperacional – Sala Cruda", "HIGH", False, ""),
    ("atp-raw", "ATP Monitoring – Raw Side", "Monitoreo de ATP – Lado Crudo", "MEDIUM", False, ""),
    ("atp-cooked", "ATP Monitoring – Cooked Side", "Monitoreo de ATP – Lado Cocido", "MEDIUM", False, ""),
    ("startup-shutdown-raw", "Start-Up/Shut-Down – Raw Side", "Arranque/Cierre – Lado Crudo", "MEDIUM", False, ""),
    ("startup-shutdown-cooked", "Start-Up/Shut-Down – Cooked Side", "Arranque/Cierre – Lado Cocido", "MEDIUM", False, ""),
    ("weekly-cleaning-oven-room", "Weekly Cleaning Checklist – Oven Room", "Lista de Limpieza Semanal – Sala de Hornos", "MEDIUM", False, ""),
    ("weekly-cleaning-cooked-room", "Weekly Cleaning Checklist – Cooked Room", "Lista de Limpieza Semanal – Sala Cocida", "MEDIUM", False, ""),
    ("weekly-cleaning-raw-room", "Weekly Cleaning Checklist – Raw Room", "Lista de Limpieza Semanal – Sala Cruda", "MEDIUM", False, ""),
    ("preventative-maintenance", "Preventative Maintenance Log", "Registro de Mantenimiento Preventivo", "MEDIUM", False, ""),
    ("operational-sanitation", "Operational Sanitation Log", "Registro de Saneamiento Operacional", "MEDIUM", False, ""),
    ("product-quality-checks", "Product Quality Checks", "Verificaciones de Calidad del Producto", "MEDIUM", False, ""),
]

# One default password per ROLE TYPE, not per person, as requested. Every
# seeded account has must_change_password=True, so the very first login
# forces a real, private password before anything else can be done.
DEFAULT_PASSWORDS = {
    "ADMIN": "Admin#2024!",
    "USER": "User#2024!",
    "SUPERVISOR": "Super#2024!",
    "AUDITOR": "Audit#2024!",
}

DEFAULT_ACCOUNTS = [
    # username, first, last, initials, is_administrator, role_password_key
    ("admin1", "Pat", "Ramirez", "PR", True, "ADMIN"),
    ("usera", "Alex", "Johnson", "AJ", False, "USER"),
    ("userb", "Bailey", "Smith", "BS", False, "USER"),
    ("userc", "Casey", "Nguyen", "CN", False, "USER"),
    ("userd", "Drew", "Patel", "DP", False, "USER"),
    ("usere", "Emerson", "Lee", "EL", False, "USER"),
    ("supervisor1", "Jordan", "Bennett", "JB", False, "SUPERVISOR"),
    ("auditor1", "Sam", "Diaz", "SD", False, "AUDITOR"),
]

# Cooked Production Yield Log role assignments (USER A completes, one supervisor verifies)
ROLE_ASSIGNMENTS = [
    ("usera", "cooked-yield", "USER"),
    ("supervisor1", "cooked-yield", "SUPERVISOR"),
    ("auditor1", "cooked-yield", "AUDITOR"),
]

# Predefined dropdown values seen on the real Cooked Production Yield Log form
PREDEFINED_VALUES = {
    "product_type": ["Lamb Lung", "Beef Lung", "Chicken Jerky", "Sweet Potato Chew"],
    "packaging_size": ["Lamb Lung", "Beef Lung", "Chicken Jerky", "Sweet Potato Chew"],
    "yield_log_task": [
        "Unload oven",
        "Unload carts",
        "QA sample",
        "Weigh",
        "Clean",
        "Clean-up",
        "Document",
    ],
}


class Command(BaseCommand):
    help = "Seeds form types, default role-based accounts, role assignments, and demo predefined values."

    @transaction.atomic
    def handle(self, *args, **options):
        for order, (code, name_en, name_es, priority, implemented, url_name) in enumerate(FORM_TYPES):
            obj, created = FormType.objects.update_or_create(
                code=code,
                defaults=dict(
                    name_en=name_en,
                    name_es=name_es,
                    priority=priority,
                    is_implemented=implemented,
                    url_name=url_name,
                    sort_order=order,
                ),
            )
            self.stdout.write(f"{'created' if created else 'updated'} form type: {obj}")

        for username, first, last, initials, is_admin, role_key in DEFAULT_ACCOUNTS:
            user, created = User.objects.get_or_create(
                username=username,
                defaults=dict(first_name=first, last_name=last, initials=initials, is_administrator=is_admin),
            )
            if created:
                user.set_password(DEFAULT_PASSWORDS[role_key])
                user.must_change_password = True
                user.is_staff = is_admin
                user.save()
                self.stdout.write(self.style.SUCCESS(f"created user {username} (default password: {DEFAULT_PASSWORDS[role_key]})"))
            else:
                self.stdout.write(f"user already exists: {username}")

        for username, form_code, role in ROLE_ASSIGNMENTS:
            user = User.objects.get(username=username)
            form_type = FormType.objects.get(code=form_code)
            FormRoleAssignment.objects.update_or_create(user=user, form_type=form_type, defaults={"role": role, "is_active": True})
            self.stdout.write(f"assigned {username} as {role} on {form_code}")

        cooked_yield = FormType.objects.get(code="cooked-yield")
        for field_key, values in PREDEFINED_VALUES.items():
            for i, value in enumerate(values):
                PredefinedValue.objects.get_or_create(
                    form_type=cooked_yield, field_key=field_key, value_en=value, defaults={"sort_order": i}
                )

        self.stdout.write(self.style.SUCCESS("Seed complete."))
        self.stdout.write(self.style.WARNING(
            "Default passwords (force a change on first login): "
            + ", ".join(f"{k}={v}" for k, v in DEFAULT_PASSWORDS.items())
        ))
