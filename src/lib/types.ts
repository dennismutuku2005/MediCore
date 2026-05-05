export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  email: string;
  phone: string;
  ward: string;
  status: 'active' | 'inactive';
  username: string;
}

export interface Nurse {
  id: string;
  name: string;
  ward: string;
  shift: 'Morning' | 'Evening' | 'Night';
  status: 'active' | 'inactive';
  email: string;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female';
  bloodType: string;
  diagnosis: string;
  ward: string;
  assignedDoctor: string;
  admissionDate: string;
  status: 'admitted' | 'discharged' | 'outpatient';
  contact: string;
  email: string;
  emergencyContact: string;
  emergencyPhone: string;
  insuranceProvider: string;
  policyNumber: string;
  insuranceExpiry: string;
}

export interface Appointment {
  id: string;
  patient: string;
  doctor: string;
  date: string;
  time: string;
  reason: string;
  department: string;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
}

export interface LabTest {
  id: string;
  patient: string;
  doctor: string;
  testType: string;
  urgency: 'STAT' | 'Routine';
  dateRequested: string;
  dateCompleted?: string;
  status: 'pending' | 'in-progress' | 'completed';
  result: string | null;
  flag?: 'normal' | 'abnormal';
  technician?: string;
  notes?: string;
  referenceRange?: string;
}

export interface LabTechnician {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'inactive';
  phone: string;
}

export interface Prescription {
  id: string;
  patient: string;
  doctor: string;
  medication: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate: string;
  instructions: string;
  status: 'active' | 'completed' | 'cancelled';
}

export interface Vitals {
  patientId: string;
  bp: string;
  hr: number;
  temp: number;
  spo2: number;
  rr: number;
  weight: number;
  timestamp: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  reorderLevel: number;
  status: 'In Stock' | 'Low' | 'Out of Stock';
}

export interface BillingItem {
  id: string;
  patient: string;
  service: string;
  date: string;
  amount: number;
  status: 'Paid' | 'Pending';
}

export interface NurseTask {
  id: string;
  patient: string;
  description: string;
  dueTime: string;
  priority: 'Low' | 'Medium' | 'High';
  column: 'todo' | 'inprogress' | 'done';
  assignedNurse: string;
}

export interface MedicationAdmin {
  id: string;
  patient: string;
  medication: string;
  dose: string;
  timeDue: string;
  administered: boolean;
  administeredAt: string | null;
  administeredBy: string | null;
  notes: string;
}

export interface ActivityEntry {
  id: string;
  icon: 'vitals' | 'meds' | 'task' | 'general';
  description: string;
  patient: string;
  timestamp: string;
  date: string;
}

export interface DoctorNote {
  id: string;
  patientId: string;
  patient: string;
  doctor: string;
  date: string;
  content: string;
  isPrivate: boolean;
}

export interface Ward {
  name: string;
  totalBeds: number;
  occupied: number;
  available: number;
  beds: WardBed[];
}

export interface WardBed {
  number: string;
  status: 'available' | 'occupied' | 'reserved';
  patient?: string;
}

export type UserRole = 'admin' | 'doctor' | 'nurse' | 'patient' | 'labtech';
