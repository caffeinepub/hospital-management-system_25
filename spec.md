# Enterprise Hospital Management System (HMS)

## Current State
- Backend: Full Motoko backend with patients, doctors, appointments, prescriptions, inventory, billing, activity logs, role-based access
- Frontend: Blank App.tsx — no UI implemented yet
- Authorization: Role-based (admin, doctor, nurse, receptionist, pharmacist)

## Requested Changes (Diff)

### Add
- Super Admin dashboard with KPI widgets (patients, doctors, appointments, revenue, bed stats, emergency alerts, medicine stock alerts)
- EMR (Electronic Medical Record) system per patient with timeline
- OPD/IPD management with bed allocation and room management
- Doctor management portal with scheduling
- Smart appointment system with calendar view and queue
- Laboratory Information System (LIS) with test booking and results
- Pharmacy management with inventory, batch, expiry alerts
- Advanced billing with GST, insurance, multiple payment methods
- Insurance claim management
- Staff management with attendance and shift scheduling
- Emergency department monitoring
- Bed & Ward management (ICU, private, general)
- Analytics & reporting dashboard
- Role-based access control UI
- Login page with role selection
- Navigation sidebar

### Modify
- App.tsx: Replace blank canvas with full HMS app

### Remove
- Nothing to remove

## Implementation Plan
1. Create Login page with role selection (Admin, Doctor, Nurse, Receptionist, Pharmacist)
2. Build main Layout with sidebar navigation for all modules
3. Dashboard page with real stats from backend + mock widgets for beds/emergency
4. Patients list + EMR detail page with timeline
5. Doctors management page
6. Appointments page with calendar/queue
7. OPD/IPD page with bed management
8. Lab (LIS) page with test management
9. Pharmacy page with inventory and expiry alerts
10. Billing page with GST calculation and invoice
11. Insurance claims page
12. Staff management page
13. Emergency monitoring page
14. Analytics/Reports page
15. Role-based menu visibility
