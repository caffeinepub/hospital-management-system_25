import Array "mo:core/Array";
import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Order "mo:core/Order";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import List "mo:core/List";
import Time "mo:core/Time";
import Int "mo:core/Int";
import Float "mo:core/Float";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Data Types
  type UserRole = AccessControl.UserRole;

  public type HospitalRole = {
    #admin;
    #doctor;
    #nurse;
    #receptionist;
    #pharmacist;
  };

  public type UserProfile = {
    name : Text;
    role : HospitalRole;
    email : Text;
    phone : Text;
  };

  public type Patient = {
    id : Text;
    name : Text;
    age : Nat;
    gender : Text;
    phone : Text;
    email : Text;
    address : Text;
    bloodGroup : Text;
    medicalHistory : Text;
    registeredAt : Int;
    createdBy : Principal;
  };

  module Patient {
    public func compare(p1 : Patient, p2 : Patient) : Order.Order {
      Text.compare(p1.id, p2.id);
    };
  };

  public type Doctor = {
    id : Text;
    name : Text;
    specialization : Text;
    phone : Text;
    email : Text;
    available : Bool;
    registeredAt : Int;
  };

  module Doctor {
    public func compare(d1 : Doctor, d2 : Doctor) : Order.Order {
      Text.compare(d1.id, d2.id);
    };
  };

  public type AppointmentStatus = {
    #scheduled;
    #completed;
    #cancelled;
  };

  public type Appointment = {
    id : Text;
    patientId : Text;
    doctorId : Text;
    date : Text;
    time : Text;
    status : AppointmentStatus;
    reason : Text;
    notes : Text;
    createdBy : Principal;
  };

  module Appointment {
    public func compare(a1 : Appointment, a2 : Appointment) : Order.Order {
      Text.compare(a1.id, a2.id);
    };
  };

  public type Medicine = {
    name : Text;
    dosage : Text;
    duration : Text;
  };

  public type Prescription = {
    id : Text;
    appointmentId : Text;
    patientId : Text;
    doctorId : Text;
    medicines : [Medicine];
    notes : Text;
    createdAt : Int;
    createdBy : Principal;
  };

  module Prescription {
    public func compare(p1 : Prescription, p2 : Prescription) : Order.Order {
      Text.compare(p1.id, p2.id);
    };
  };

  public type InventoryItem = {
    id : Text;
    name : Text;
    category : Text;
    quantity : Nat;
    unit : Text;
    reorderLevel : Nat;
    price : Float;
    expiryDate : Text;
  };

  module InventoryItem {
    public func compare(i1 : InventoryItem, i2 : InventoryItem) : Order.Order {
      Text.compare(i1.id, i2.id);
    };
  };

  public type BillItem = {
    description : Text;
    amount : Float;
  };

  public type PaymentStatus = {
    #pending;
    #paid;
    #cancelled;
  };

  public type Bill = {
    id : Text;
    patientId : Text;
    appointmentId : Text;
    items : [BillItem];
    subtotal : Float;
    gstPercent : Float;
    gstAmount : Float;
    totalAmount : Float;
    paymentStatus : PaymentStatus;
    createdAt : Int;
  };

  module Bill {
    public func compare(b1 : Bill, b2 : Bill) : Order.Order {
      Text.compare(b1.id, b2.id);
    };
  };

  public type ActivityLog = {
    id : Text;
    userId : Principal;
    role : HospitalRole;
    action : Text;
    entityType : Text;
    entityId : Text;
    timestamp : Int;
  };

  module ActivityLog {
    public func compare(a1 : ActivityLog, a2 : ActivityLog) : Order.Order {
      Int.compare(a2.timestamp, a1.timestamp);
    };
  };

  public type DashboardStats = {
    totalPatients : Nat;
    totalDoctors : Nat;
    scheduledAppointments : Nat;
    completedAppointments : Nat;
    cancelledAppointments : Nat;
    pendingBillsTotal : Float;
    lowStockItemsCount : Nat;
    recentActivityCount : Nat;
  };

  // State
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Storage
  let userProfiles = Map.empty<Principal, UserProfile>();
  let patients = Map.empty<Text, Patient>();
  let doctors = Map.empty<Text, Doctor>();
  let appointments = Map.empty<Text, Appointment>();
  let prescriptions = Map.empty<Text, Prescription>();
  let inventoryItems = Map.empty<Text, InventoryItem>();
  let bills = Map.empty<Text, Bill>();
  let activityLogs = Map.empty<Text, ActivityLog>();

  // Helper Functions
  func isDoctor(caller : Principal) : Bool {
    switch (userProfiles.get(caller)) {
      case (null) { false };
      case (?profile) {
        switch (profile.role) {
          case (#doctor) { true };
          case (_) { false };
        };
      };
    };
  };

  func isPharmacist(caller : Principal) : Bool {
    switch (userProfiles.get(caller)) {
      case (null) { false };
      case (?profile) {
        switch (profile.role) {
          case (#pharmacist) { true };
          case (_) { false };
        };
      };
    };
  };

  func canAccessPatient(caller : Principal, patient : Patient) : Bool {
    if (AccessControl.isAdmin(accessControlState, caller)) {
      return true;
    };
    if (patient.createdBy == caller) {
      return true;
    };
    // Doctors and nurses can access all patients
    switch (userProfiles.get(caller)) {
      case (null) { false };
      case (?profile) {
        switch (profile.role) {
          case (#doctor or #nurse) { true };
          case (_) { false };
        };
      };
    };
  };

  func canModifyAppointment(caller : Principal, appointment : Appointment) : Bool {
    if (AccessControl.isAdmin(accessControlState, caller)) {
      return true;
    };
    if (appointment.createdBy == caller) {
      return true;
    };
    // Doctors and receptionists can modify appointments
    switch (userProfiles.get(caller)) {
      case (null) { false };
      case (?profile) {
        switch (profile.role) {
          case (#doctor or #receptionist) { true };
          case (_) { false };
        };
      };
    };
  };

  func logActivity(userId : Principal, action : Text, entityType : Text, entityId : Text) {
    let role = switch (userProfiles.get(userId)) {
      case (null) { #admin };
      case (?profile) { profile.role };
    };
    let logId = Time.now().toText() # "-" # userId.toText();
    let log : ActivityLog = {
      id = logId;
      userId = userId;
      role = role;
      action = action;
      entityType = entityType;
      entityId = entityId;
      timestamp = Time.now();
    };
    activityLogs.add(logId, log);
  };

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
    logActivity(caller, "save_profile", "user", caller.toText());
  };

  // Patient CRUD
  public shared ({ caller }) func createPatient(patient : Patient) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create patients");
    };
    let patientWithOwner = {
      id = patient.id;
      name = patient.name;
      age = patient.age;
      gender = patient.gender;
      phone = patient.phone;
      email = patient.email;
      address = patient.address;
      bloodGroup = patient.bloodGroup;
      medicalHistory = patient.medicalHistory;
      registeredAt = patient.registeredAt;
      createdBy = caller;
    };
    patients.add(patient.id, patientWithOwner);
    logActivity(caller, "create", "patient", patient.id);
  };

  public query ({ caller }) func getPatient(id : Text) : async Patient {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view patients");
    };
    switch (patients.get(id)) {
      case (null) { Runtime.trap("Patient not found") };
      case (?patient) {
        if (not canAccessPatient(caller, patient)) {
          Runtime.trap("Unauthorized: Cannot access this patient");
        };
        patient;
      };
    };
  };

  public shared ({ caller }) func updatePatient(id : Text, updatedPatient : Patient) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update patients");
    };
    switch (patients.get(id)) {
      case (null) { Runtime.trap("Patient not found") };
      case (?existingPatient) {
        if (not canAccessPatient(caller, existingPatient)) {
          Runtime.trap("Unauthorized: Cannot modify this patient");
        };
        let patientWithOwner = {
          id = updatedPatient.id;
          name = updatedPatient.name;
          age = updatedPatient.age;
          gender = updatedPatient.gender;
          phone = updatedPatient.phone;
          email = updatedPatient.email;
          address = updatedPatient.address;
          bloodGroup = updatedPatient.bloodGroup;
          medicalHistory = updatedPatient.medicalHistory;
          registeredAt = updatedPatient.registeredAt;
          createdBy = existingPatient.createdBy;
        };
        patients.add(id, patientWithOwner);
        logActivity(caller, "update", "patient", id);
      };
    };
  };

  public shared ({ caller }) func deletePatient(id : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete patients");
    };
    if (not patients.containsKey(id)) {
      Runtime.trap("Patient not found");
    };
    patients.remove(id);
    logActivity(caller, "delete", "patient", id);
  };

  public query ({ caller }) func getAllPatients() : async [Patient] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view patients");
    };
    let iter = patients.values();
    let allPatients = iter.toArray();
    if (AccessControl.isAdmin(accessControlState, caller)) {
      return allPatients.sort();
    };
    // Filter patients based on access rights
    let filtered = allPatients.filter(
      func(p : Patient) : Bool { canAccessPatient(caller, p) },
    );
    filtered.sort();
  };

  // Doctor CRUD
  public shared ({ caller }) func createDoctor(doctor : Doctor) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can create doctors");
    };
    doctors.add(doctor.id, doctor);
    logActivity(caller, "create", "doctor", doctor.id);
  };

  public query ({ caller }) func getDoctor(id : Text) : async Doctor {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view doctors");
    };
    switch (doctors.get(id)) {
      case (null) { Runtime.trap("Doctor not found") };
      case (?doctor) { doctor };
    };
  };

  public shared ({ caller }) func updateDoctor(id : Text, updatedDoctor : Doctor) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update doctors");
    };
    if (not doctors.containsKey(id)) {
      Runtime.trap("Doctor not found");
    };
    doctors.add(id, updatedDoctor);
    logActivity(caller, "update", "doctor", id);
  };

  public shared ({ caller }) func deleteDoctor(id : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete doctors");
    };
    if (not doctors.containsKey(id)) {
      Runtime.trap("Doctor not found");
    };
    doctors.remove(id);
    logActivity(caller, "delete", "doctor", id);
  };

  public query ({ caller }) func getAllDoctors() : async [Doctor] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view doctors");
    };
    let iter = doctors.values();
    iter.toArray().sort();
  };

  // Appointment CRUD
  public shared ({ caller }) func createAppointment(appt : Appointment) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create appointments");
    };
    let apptWithOwner = {
      id = appt.id;
      patientId = appt.patientId;
      doctorId = appt.doctorId;
      date = appt.date;
      time = appt.time;
      status = appt.status;
      reason = appt.reason;
      notes = appt.notes;
      createdBy = caller;
    };
    appointments.add(appt.id, apptWithOwner);
    logActivity(caller, "create", "appointment", appt.id);
  };

  public query ({ caller }) func getAppointment(id : Text) : async Appointment {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view appointments");
    };
    switch (appointments.get(id)) {
      case (null) { Runtime.trap("Appointment not found") };
      case (?appt) { appt };
    };
  };

  public shared ({ caller }) func updateAppointment(id : Text, updatedAppt : Appointment) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update appointments");
    };
    switch (appointments.get(id)) {
      case (null) { Runtime.trap("Appointment not found") };
      case (?existingAppt) {
        if (not canModifyAppointment(caller, existingAppt)) {
          Runtime.trap("Unauthorized: Cannot modify this appointment");
        };
        let apptWithOwner = {
          id = updatedAppt.id;
          patientId = updatedAppt.patientId;
          doctorId = updatedAppt.doctorId;
          date = updatedAppt.date;
          time = updatedAppt.time;
          status = updatedAppt.status;
          reason = updatedAppt.reason;
          notes = updatedAppt.notes;
          createdBy = existingAppt.createdBy;
        };
        appointments.add(id, apptWithOwner);
        logActivity(caller, "update", "appointment", id);
      };
    };
  };

  public shared ({ caller }) func deleteAppointment(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete appointments");
    };
    switch (appointments.get(id)) {
      case (null) { Runtime.trap("Appointment not found") };
      case (?appt) {
        if (not canModifyAppointment(caller, appt)) {
          Runtime.trap("Unauthorized: Cannot delete this appointment");
        };
        appointments.remove(id);
        logActivity(caller, "delete", "appointment", id);
      };
    };
  };

  public query ({ caller }) func getAllAppointments() : async [Appointment] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view appointments");
    };
    let iter = appointments.values();
    iter.toArray().sort();
  };

  public query ({ caller }) func getAppointmentsByPatient(patientId : Text) : async [Appointment] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view appointments");
    };
    let iter = appointments.values();
    let filtered = iter.toArray().filter(
      func(a : Appointment) : Bool { a.patientId == patientId },
    );
    filtered.sort();
  };

  public query ({ caller }) func getAppointmentsByDoctor(doctorId : Text) : async [Appointment] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view appointments");
    };
    let iter = appointments.values();
    let filtered = iter.toArray().filter(
      func(a : Appointment) : Bool { a.doctorId == doctorId },
    );
    filtered.sort();
  };

  public query ({ caller }) func getAppointmentsByStatus(status : AppointmentStatus) : async [Appointment] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view appointments");
    };
    let iter = appointments.values();
    let filtered = iter.toArray().filter(
      func(a : Appointment) : Bool { a.status == status },
    );
    filtered.sort();
  };

  // Prescription CRUD
  public shared ({ caller }) func createPrescription(prescription : Prescription) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create prescriptions");
    };
    if (not isDoctor(caller)) {
      Runtime.trap("Unauthorized: Only doctors can create prescriptions");
    };
    let prescriptionWithOwner = {
      id = prescription.id;
      appointmentId = prescription.appointmentId;
      patientId = prescription.patientId;
      doctorId = prescription.doctorId;
      medicines = prescription.medicines;
      notes = prescription.notes;
      createdAt = prescription.createdAt;
      createdBy = caller;
    };
    prescriptions.add(prescription.id, prescriptionWithOwner);
    logActivity(caller, "create", "prescription", prescription.id);
  };

  public query ({ caller }) func getPrescription(id : Text) : async Prescription {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view prescriptions");
    };
    switch (prescriptions.get(id)) {
      case (null) { Runtime.trap("Prescription not found") };
      case (?prescription) { prescription };
    };
  };

  public shared ({ caller }) func updatePrescription(id : Text, updatedPrescription : Prescription) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update prescriptions");
    };
    if (not isDoctor(caller)) {
      Runtime.trap("Unauthorized: Only doctors can update prescriptions");
    };
    switch (prescriptions.get(id)) {
      case (null) { Runtime.trap("Prescription not found") };
      case (?existingPrescription) {
        if (existingPrescription.createdBy != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only update your own prescriptions");
        };
        let prescriptionWithOwner = {
          id = updatedPrescription.id;
          appointmentId = updatedPrescription.appointmentId;
          patientId = updatedPrescription.patientId;
          doctorId = updatedPrescription.doctorId;
          medicines = updatedPrescription.medicines;
          notes = updatedPrescription.notes;
          createdAt = updatedPrescription.createdAt;
          createdBy = existingPrescription.createdBy;
        };
        prescriptions.add(id, prescriptionWithOwner);
        logActivity(caller, "update", "prescription", id);
      };
    };
  };

  public shared ({ caller }) func deletePrescription(id : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete prescriptions");
    };
    if (not prescriptions.containsKey(id)) {
      Runtime.trap("Prescription not found");
    };
    prescriptions.remove(id);
    logActivity(caller, "delete", "prescription", id);
  };

  public query ({ caller }) func getAllPrescriptions() : async [Prescription] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view prescriptions");
    };
    let iter = prescriptions.values();
    iter.toArray().sort();
  };

  public query ({ caller }) func getPrescriptionsByPatient(patientId : Text) : async [Prescription] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view prescriptions");
    };
    let iter = prescriptions.values();
    let filtered = iter.toArray().filter(
      func(p : Prescription) : Bool { p.patientId == patientId },
    );
    filtered.sort();
  };

  public query ({ caller }) func getPrescriptionsByDoctor(doctorId : Text) : async [Prescription] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view prescriptions");
    };
    let iter = prescriptions.values();
    let filtered = iter.toArray().filter(
      func(p : Prescription) : Bool { p.doctorId == doctorId },
    );
    filtered.sort();
  };

  // Inventory CRUD
  public shared ({ caller }) func createInventoryItem(item : InventoryItem) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can manage inventory");
    };
    if (not (isPharmacist(caller) or AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only pharmacists and admins can manage inventory");
    };
    inventoryItems.add(item.id, item);
    logActivity(caller, "create", "inventory", item.id);
  };

  public query ({ caller }) func getInventoryItem(id : Text) : async InventoryItem {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view inventory");
    };
    switch (inventoryItems.get(id)) {
      case (null) { Runtime.trap("Inventory item not found") };
      case (?item) { item };
    };
  };

  public shared ({ caller }) func updateInventoryItem(id : Text, updatedItem : InventoryItem) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can manage inventory");
    };
    if (not (isPharmacist(caller) or AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only pharmacists and admins can manage inventory");
    };
    if (not inventoryItems.containsKey(id)) {
      Runtime.trap("Inventory item not found");
    };
    inventoryItems.add(id, updatedItem);
    logActivity(caller, "update", "inventory", id);
  };

  public shared ({ caller }) func deleteInventoryItem(id : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete inventory items");
    };
    if (not inventoryItems.containsKey(id)) {
      Runtime.trap("Inventory item not found");
    };
    inventoryItems.remove(id);
    logActivity(caller, "delete", "inventory", id);
  };

  public query ({ caller }) func getAllInventoryItems() : async [InventoryItem] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view inventory");
    };
    let iter = inventoryItems.values();
    iter.toArray().sort();
  };

  public query ({ caller }) func getLowStockItems() : async [InventoryItem] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view inventory");
    };
    let iter = inventoryItems.values();
    let filtered = iter.toArray().filter(
      func(item : InventoryItem) : Bool { item.quantity <= item.reorderLevel },
    );
    filtered.sort();
  };

  // Bill CRUD
  public shared ({ caller }) func createBill(bill : Bill) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create bills");
    };
    bills.add(bill.id, bill);
    logActivity(caller, "create", "bill", bill.id);
  };

  public query ({ caller }) func getBill(id : Text) : async Bill {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view bills");
    };
    switch (bills.get(id)) {
      case (null) { Runtime.trap("Bill not found") };
      case (?bill) { bill };
    };
  };

  public shared ({ caller }) func updateBill(id : Text, updatedBill : Bill) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update bills");
    };
    if (not bills.containsKey(id)) {
      Runtime.trap("Bill not found");
    };
    bills.add(id, updatedBill);
    logActivity(caller, "update", "bill", id);
  };

  public shared ({ caller }) func deleteBill(id : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete bills");
    };
    if (not bills.containsKey(id)) {
      Runtime.trap("Bill not found");
    };
    bills.remove(id);
    logActivity(caller, "delete", "bill", id);
  };

  public query ({ caller }) func getAllBills() : async [Bill] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view bills");
    };
    let iter = bills.values();
    iter.toArray().sort();
  };

  public query ({ caller }) func getBillsByPatient(patientId : Text) : async [Bill] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view bills");
    };
    let iter = bills.values();
    let filtered = iter.toArray().filter(
      func(b : Bill) : Bool { b.patientId == patientId },
    );
    filtered.sort();
  };

  public query ({ caller }) func getBillsByPaymentStatus(status : PaymentStatus) : async [Bill] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view bills");
    };
    let iter = bills.values();
    let filtered = iter.toArray().filter(
      func(b : Bill) : Bool { b.paymentStatus == status },
    );
    filtered.sort();
  };

  // Activity Logs
  public shared ({ caller }) func addActivityLog(log : ActivityLog) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add activity logs");
    };
    activityLogs.add(log.id, log);
  };

  func getFirstN(array : [ActivityLog], n : Nat) : [ActivityLog] {
    let arraySize = array.size();
    let actualN = if (arraySize < n) { arraySize } else { n };
    let result = List.empty<ActivityLog>();

    var i = 0;
    while (i < actualN) {
      result.add(array[i]);
      i += 1;
    };

    result.toArray();
  };

  public query ({ caller }) func getRecentLogs() : async [ActivityLog] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view activity logs");
    };
    let iter = activityLogs.values();
    let allLogs = iter.toArray().sort();
    let count = allLogs.size();
    if (count <= 100) {
      return allLogs;
    };
    getFirstN(allLogs, 100);
  };

  public query ({ caller }) func getLogsByUser(userId : Principal) : async [ActivityLog] {
    if (caller != userId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own logs");
    };
    let iter = activityLogs.values();
    let filtered = iter.toArray().filter(
      func(log : ActivityLog) : Bool { log.userId == userId },
    );
    filtered.sort();
  };

  // Dashboard Stats
  public query ({ caller }) func getDashboardStats() : async DashboardStats {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view dashboard");
    };

    let totalPatients = patients.size();
    let totalDoctors = doctors.size();

    var scheduledCount = 0;
    var completedCount = 0;
    var cancelledCount = 0;

    for (appt in appointments.values()) {
      switch (appt.status) {
        case (#scheduled) { scheduledCount += 1 };
        case (#completed) { completedCount += 1 };
        case (#cancelled) { cancelledCount += 1 };
      };
    };

    var pendingTotal : Float = 0.0;
    for (bill in bills.values()) {
      switch (bill.paymentStatus) {
        case (#pending) { pendingTotal += bill.totalAmount };
        case (_) {};
      };
    };

    var lowStockCount = 0;
    for (item in inventoryItems.values()) {
      if (item.quantity <= item.reorderLevel) {
        lowStockCount += 1;
      };
    };

    let recentActivityCount = activityLogs.size();

    {
      totalPatients = totalPatients;
      totalDoctors = totalDoctors;
      scheduledAppointments = scheduledCount;
      completedAppointments = completedCount;
      cancelledAppointments = cancelledCount;
      pendingBillsTotal = pendingTotal;
      lowStockItemsCount = lowStockCount;
      recentActivityCount = recentActivityCount;
    };
  };
};
