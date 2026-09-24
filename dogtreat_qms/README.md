# Dog-Treat-App-Challenge

A Django web app for capturing, reviewing, and auditing the BRC food-safety
records used on the production floor. Built around one flagship form — the
**Cooked Production Yield Log** — plus the full user/role/admin framework
every other form will plug into.

## Quick start

```bash
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt

cd dogtreat_qms
python manage.py migrate
python manage.py seed_data      # registers all 18 BRC forms + demo accounts
python manage.py compilemessages  # only needed if you edit locale/es/*.po
python manage.py runserver
```

Visit `http://127.0.0.1:8000/`. `seed_data` is idempotent — safe to re-run.

### Demo accounts (default passwords — one per role, as requested)

| Username | Role | Default password | Notes |
|---|---|---|---|
| `admin1` | Administrator | `Admin#2024!` | manages users, roles, dropdown values |
| `usera` | User | `User#2024!` | assigned USER on Cooked Yield Log |
| `userb`…`usere` | User | `User#2024!` | seeded, not yet assigned to a form |
| `supervisor1` | Supervisor | `Super#2024!` | assigned SUPERVISOR on Cooked Yield Log |
| `auditor1` | Auditor | `Audit#2024!` | assigned AUDITOR (read-only) on Cooked Yield Log |

Every seeded account has `must_change_password=True`, so the very first sign-in
forces a real, private password before anything else is reachable. **Change
these defaults (and the `DJANGO_SECRET_KEY`) before this goes anywhere near
the internet.**

## What's fully built

- **Auth & roles** — custom `User` model, per-form `FormRoleAssignment`
  (one role per person per form, enforced by a database constraint — a
  person can be a User on one form and a Supervisor on another, never both
  on the same one), forced password change on first login.
- **Admin panel** (`/accounts/users/`) — Administrator-only: create, edit,
  deactivate, or delete users; assign form roles; manage predefined dropdown
  values per form/field, with deactivation instead of deletion so historical
  records stay intact.
- **Cooked Production Yield Log** (`/forms/cooked-yield/`) — modeled
  directly on the plant's paper form (I pulled the actual reference image
  from your GitHub repo to get the real fields): product/lot identification,
  packaging line items, consumables counts, waste/yield, employee/task/time
  line items, notes. Full **OPEN → COMPLETED → REVIEWED** workflow with
  user+timestamp stamps at each stage, supervisor per-field notes (without
  ever touching the original entry), search/retrieve by date range, lot
  number, or status, and print (single or multi-select batch).
- **Theming & accessibility** — light/dark mode, three font-size steps
  (small/medium/large, ±% via a CSS custom property so every element scales
  together), self-hosted Inter font (no external CDN — plants often run on
  locked-down networks), 44px minimum tap targets, visible focus rings,
  skip-to-content link, semantic labels throughout, print stylesheet.
- **Bilingual** — English/Spanish via Django's i18n, all 211 user-facing
  strings translated (`locale/es/LC_MESSAGES/`), language switcher in the
  header.
- **Security** — ORM everywhere (no raw SQL, so no SQL-injection surface),
  Django's CSRF protection on every form, hashed passwords, `X-Frame-Options:
  DENY`, HttpOnly session cookies, server-side validation on every field
  (client-side HTML5 validation is a convenience layer only, never the only
  check).
- **Automated tests** (`brc_forms/tests.py`) — exercise the full lifecycle:
  create → complete → review, permission boundaries for each role, the
  one-role-per-form constraint, predefined-value deactivation, and the
  language switch. Run with `python manage.py test`.

## Design decisions worth knowing about

- **User deletion is soft by default.** The spec says the Administrator can
  "add, delete" users, but every signed/reviewed BRC record points at the
  user who signed it (`on_delete=PROTECT`). Deleting an account that has
  ever completed or reviewed a record would silently break that record's
  audit trail — itself a BRC nonconformance — so the app blocks the delete
  and tells the admin to **Deactivate** instead. An account that never
  touched a record can still be deleted outright.
- **Yield % is entered/confirmed, not auto-calculated.** The paper form
  doesn't show a raw-material starting weight to derive yield from (that
  lives on the *Raw* Production Yield Log), so rather than guess at a
  formula, the field is left as an entry the User fills in and the
  Supervisor confirms during review. Flag this to your QA lead if there's a
  specific formula to wire in — it's a one-line change once you tell me
  what it is.
- **AUDITOR is a per-form role**, like User and Supervisor, rather than a
  single global flag — matching the spec's "the administrator determines
  which individuals have which roles on each form." If you'd rather auditors
  see everything by default, that's a small change to
  `accounts/permissions.py`.

## Extending to the other 17 forms

`seed_data` already registers all 18 BRC records (`accounts/management/
commands/seed_data.py`) so the dashboard, role matrix, and predefined-value
admin already reflect the whole program — only `cooked-yield` has live
data-entry screens (`is_implemented=True`). To add another form, copy the
`brc_forms` pattern:

1. Add a model inheriting `FormRecordBase` (gives you `status`,
   `record_date`, and the created/completed/reviewed stamps for free) plus
   any child line-item models it needs, in `brc_forms/models.py` or a new
   app.
2. Add a `ModelForm` (+ `inlineformset_factory` for any line items) in
   `forms.py`, sourcing dropdowns from `predefined_choices(form_type_code,
   field_key)`.
3. Copy the five `yield_log_*` views (list/create/edit/review/print) and
   swap in the new model — the permission helpers
   (`can_enter_data`/`can_review`/`can_view_only` in `accounts/permissions.py`)
   and the `FieldNote` generic-relation note system work unchanged for any
   form.
4. Copy the five templates, adjusting the fields shown.
5. Flip `is_implemented=True` and set `url_name` for that `FormType` row in
   `seed_data.py`.

The **multi-user sequential forms** (e.g. the five Pre-Op Inspection
variants, filled in stages by different people with notification when a
section becomes available) will need one addition this build doesn't
include: a "section" sub-model per record (one row per person's portion)
with its own completed-by stamp, so the parent record only reaches
COMPLETED once every section is done. Happy to build that pattern into the
next form whenever you're ready to prioritize it — just say which form to
do next.

## Project layout

```
dogtreat_qms/
├── accounts/        # User model, roles, predefined values, admin panel, auth
├── core/            # dashboard, theme/font-scale/i18n plumbing
├── brc_forms/       # BRC record models/forms/views (Cooked Yield Log lives here)
├── templates/        
├── static/          # css/js + self-hosted Inter font
└── locale/es/        # Spanish translations
```

## Key Details
We are a small employee-owned producer of innovative dog treats and chews.  We insist upon the highest quality in our products and engage with BRC (British Retail Consortium) to validate these high standards in food safety and process quality.  As with any food quality and safety certification it is required that processes and procedures are monitored, measured, documented, reviewed and audited.  Ultimately, the primary purpose of these BRC records is to audited by a third party auditor and occasionally used for internal purposes.
These records are relatively simple and often validate a specific process (cooking, packaging, etc.). These documents all have similarities such as approvals, retrieval, editing, security, and record retention.  They will be created by a USER or multiple USERS in a sequence, reviewed by a SUPERVISOR, and specifically or randomly selected and audited by an AUDITOR.
the objective is to create a web app with an easy to use database to capture, retain, and retrieve the data from these forms. 
requirements: The app should be wcag compliant, should have multiple font toggle (small, medium and large), with medium being the default.  When changed it should change the text and elements by a percentage value.  It should also have a light and dark mode.  Light mode should be default.  When it changes the elements and text should update accordingly so that it is visible to the user
The app should be bilingual (English and Spanish).  It should have an admin page as well as the forms with the right roles attached to the forms. It should have a sign in page for the roles, youc an use a default password for each role type.  the admin should be able to update it based on new users.  The admin is the only user that should be able to add, delete users. 
Ensure the forms have proper form validation.  No ablility to do sql injection.  Use apple design guidelines (https://developer.apple.com/design/human-interface-guidelines/)
Each form will allow for the following functionality:

SECURITY:  USERS are allowed to enter and select information from drop down menus as well as edit entries until a form is “COMPLETED”.  Once completed the form is user and date stamped.

SUPERVISORS have the ability to review the document make notes on each field i.e. edits but cannot change the original entries.  Once the “REVIEWED” field is selected the form is user and date stamped as reviewed. 

The ADMINISTRATOR can create/edit/delete individuals who are designed as USERS and authority of SUPERVISORS for each form.  The ADMINISTRATOR has the ability to add (or make inactive) entries (additional or discontinued processes) in predefined value fields in the forms.

The security is form based and USERS roles are determined uniquely for each form.  Therefore, an individual can be a USER on one form and a SUPERVISOR on another but cannot be both on the same form.  The ADMINISTRATOR determines which individuals have which roles on each form.

USABILITY: Each field on the form will be predefined and have the following types of information.  Fields will be predefined as required and non-required fields.  Required fields could have defined values and in some cases N/A (not applicable) is a valid option.

Dates and time:  Date fields will default to today’s date but may provide the option to pull down a calendar and/or select a date. Time fields will be entered based upon 24 hour values.

Open narrative: Allow for USERS to enter narrative as needed either alphanumeric or numeric values.

Yes/No: Provide drop down with YES or NO options and some cases N/A.

Either/Or Fields: Checkmark either area of the form to confirm correct option or completed task.

Drop down predefined values:  Provide relevant values in a drop down for predefined value fields.

Calculations:  Calculations range from totaling columns to calculating values coming from other fields.

Initials:  When a USER enters values on a multi-USER form their predefined initials will be entered into the field after acceptance/confirmation that the information is correct.

COMPLETION NOTIFICATION: Some forms will be used in sequence by USERS and eventually be approved by the SUPERVISOR.  In these cases each section of the form will be defined to be entered by different USERS and in a defined sequence.  Each USER will be notified when it is available for their entries or, in the case of the SUPERVISOR, to be reviewed and approved.  Until the USERS complete the form in totality and confirm its completion it would be considered “OPEN” to the USER.  Until the SUPERVISOR approves the individually completed forms that form would be considered “OPEN” for review.

SUPERVISOR can attach a note to individual fields as they review per above.

RETRIEVAL: Individual forms or a range of forms can be retrieved by any user on-line by using query functions appropriately defined for each form.  Once retrieved provide the user the ability to print form or multiple forms.

FORMS:          The following forms are required to be created and approved for the BRC audit.

High Project Priority:

Cooked Production Yield Log - Completed by USER “A”.  Document is verified by SUPERVISOR.  Serves as the primary traceability documentation which is one of the twelve major portions of the BRC standards.  Also serves as valuable information for labor rates and costing information.

FORMS:          The following forms are required to be created and approved for the BRC audit.

High Project Priority:

Cooked Production Yield Log - Completed by USER “A”.  Document is verified by SUPERVISOR.  Serves as the primary traceability documentation which is one of the twelve major portions of the BRC standards.  Also serves as valuable information for labor rates and costing information.
Raw Production Yield Log – Completed by USER “D” occasionally based off of production information provided by production personnel.  Document is verified by SUPERVISOR.  Serves as the primary traceability documentation which is one of the twelve major portions of the BRC standards.  Also serves as valuable information for labor rates and costing information.
Ambient Temperature Monitoring Logs – Cooked side is filled out by USER “A” (cooked side supervisor), Raw side is filled out by USER “B”.  Document is verified by SUPERVISOR to make sure temperatures are not outside of the acceptable temperature range.
Pre-Operational Sanitation Inspections – Cooked Side, Dock, and Oven Room are completed by USER “A”, Hot Room is completed by USER “B”, and Raw Room is completed by USER “C” (five different reports with the same format but different values in "area and equipment" column).  Documents are each verified by SUPERVISOR.  Pre-Op Inspections are required by BRC Standards.


Medium Project Priority:

ATP Monitoring Forms – Raw and Cooked sides are completed by USER “B”.  Documents are verified by SUPERVISOR weekly (form is designed as a weekly form).  Information ensures all food contact surfaces are cleanly prior to production. 

Start-Up Shut-Down Forms – Raw side is completed by USER “B”, Cooked side is completed by USER “A” (two different forms with same format but different items on the list).  Verified by SUPERVISOR daily.  Document is primarily used for BRC in the tool clearance section.  The document has a starting tool count and an end of day tool count to ensure all tools remain at the end of the day (knives especially).

Weekly Cleaning Checklist – Oven Room and Cooked Room are completed by USER “A” primarily, Raw Room is completed by USER “E” (three different forms with the same format but different values in the first column).  Documents are filed in the front office after having been reviewed by SUPERVISOR.  Weekly cleaning checklists are a requirement through BRC standards.

Preventative Maintenance Log – Filled out by USER “C” and USER “D”.  After having been reviewed, the document is filed in the front office by SUPERVISOR.  Is required by BRC and serves as a way to prevent total machine failure and save the company money. 

Operational Sanitation Log – Filled out by USER “D”.  Verified by SUPERVISOR and filed in the front office.  Is required by BRC standards and serves as a validation that proper GMP’s are being followed and plant remains as sanitary as possible during the production day. 

Product Quality Checks – Filled out by USER “D”.  Reviewed and filed by SUPERVISOR in the front office.  Is required by BRC standards and serves as a way to ensure that all products are consistent and that poor quality products aren’t being shipped to customers. 

