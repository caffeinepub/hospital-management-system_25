import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface BillItem {
    description: string;
    amount: number;
}
export interface ActivityLog {
    id: string;
    action: string;
    userId: Principal;
    role: HospitalRole;
    entityId: string;
    timestamp: bigint;
    entityType: string;
}
export interface DashboardStats {
    pendingBillsTotal: number;
    totalPatients: bigint;
    recentActivityCount: bigint;
    cancelledAppointments: bigint;
    totalDoctors: bigint;
    completedAppointments: bigint;
    scheduledAppointments: bigint;
    lowStockItemsCount: bigint;
}
export interface Patient {
    id: string;
    age: bigint;
    name: string;
    createdBy: Principal;
    email: string;
    medicalHistory: string;
    bloodGroup: string;
    address: string;
    gender: string;
    phone: string;
    registeredAt: bigint;
}
export interface InventoryItem {
    id: string;
    expiryDate: string;
    name: string;
    unit: string;
    quantity: bigint;
    category: string;
    price: number;
    reorderLevel: bigint;
}
export interface Bill {
    id: string;
    paymentStatus: PaymentStatus;
    patientId: string;
    createdAt: bigint;
    gstPercent: number;
    gstAmount: number;
    totalAmount: number;
    items: Array<BillItem>;
    appointmentId: string;
    subtotal: number;
}
export interface Medicine {
    duration: string;
    dosage: string;
    name: string;
}
export interface Doctor {
    id: string;
    name: string;
    email: string;
    available: boolean;
    specialization: string;
    phone: string;
    registeredAt: bigint;
}
export interface Appointment {
    id: string;
    status: AppointmentStatus;
    doctorId: string;
    patientId: string;
    date: string;
    createdBy: Principal;
    time: string;
    notes: string;
    reason: string;
}
export interface Prescription {
    id: string;
    doctorId: string;
    patientId: string;
    createdAt: bigint;
    createdBy: Principal;
    notes: string;
    medicines: Array<Medicine>;
    appointmentId: string;
}
export interface UserProfile {
    name: string;
    role: HospitalRole;
    email: string;
    phone: string;
}
export enum AppointmentStatus {
    scheduled = "scheduled",
    cancelled = "cancelled",
    completed = "completed"
}
export enum HospitalRole {
    admin = "admin",
    doctor = "doctor",
    nurse = "nurse",
    pharmacist = "pharmacist",
    receptionist = "receptionist"
}
export enum PaymentStatus {
    cancelled = "cancelled",
    pending = "pending",
    paid = "paid"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addActivityLog(log: ActivityLog): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createAppointment(appt: Appointment): Promise<void>;
    createBill(bill: Bill): Promise<void>;
    createDoctor(doctor: Doctor): Promise<void>;
    createInventoryItem(item: InventoryItem): Promise<void>;
    createPatient(patient: Patient): Promise<void>;
    createPrescription(prescription: Prescription): Promise<void>;
    deleteAppointment(id: string): Promise<void>;
    deleteBill(id: string): Promise<void>;
    deleteDoctor(id: string): Promise<void>;
    deleteInventoryItem(id: string): Promise<void>;
    deletePatient(id: string): Promise<void>;
    deletePrescription(id: string): Promise<void>;
    getAllAppointments(): Promise<Array<Appointment>>;
    getAllBills(): Promise<Array<Bill>>;
    getAllDoctors(): Promise<Array<Doctor>>;
    getAllInventoryItems(): Promise<Array<InventoryItem>>;
    getAllPatients(): Promise<Array<Patient>>;
    getAllPrescriptions(): Promise<Array<Prescription>>;
    getAppointment(id: string): Promise<Appointment>;
    getAppointmentsByDoctor(doctorId: string): Promise<Array<Appointment>>;
    getAppointmentsByPatient(patientId: string): Promise<Array<Appointment>>;
    getAppointmentsByStatus(status: AppointmentStatus): Promise<Array<Appointment>>;
    getBill(id: string): Promise<Bill>;
    getBillsByPatient(patientId: string): Promise<Array<Bill>>;
    getBillsByPaymentStatus(status: PaymentStatus): Promise<Array<Bill>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getDashboardStats(): Promise<DashboardStats>;
    getDoctor(id: string): Promise<Doctor>;
    getInventoryItem(id: string): Promise<InventoryItem>;
    getLogsByUser(userId: Principal): Promise<Array<ActivityLog>>;
    getLowStockItems(): Promise<Array<InventoryItem>>;
    getPatient(id: string): Promise<Patient>;
    getPrescription(id: string): Promise<Prescription>;
    getPrescriptionsByDoctor(doctorId: string): Promise<Array<Prescription>>;
    getPrescriptionsByPatient(patientId: string): Promise<Array<Prescription>>;
    getRecentLogs(): Promise<Array<ActivityLog>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateAppointment(id: string, updatedAppt: Appointment): Promise<void>;
    updateBill(id: string, updatedBill: Bill): Promise<void>;
    updateDoctor(id: string, updatedDoctor: Doctor): Promise<void>;
    updateInventoryItem(id: string, updatedItem: InventoryItem): Promise<void>;
    updatePatient(id: string, updatedPatient: Patient): Promise<void>;
    updatePrescription(id: string, updatedPrescription: Prescription): Promise<void>;
}
