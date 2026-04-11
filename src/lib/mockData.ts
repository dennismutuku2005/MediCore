import {
  Doctor, Nurse, Patient, Appointment, LabTest, LabTechnician,
  Prescription, Vitals, InventoryItem, BillingItem, NurseTask,
  MedicationAdmin, ActivityEntry, DoctorNote, Ward
} from './types';

export const doctors: Doctor[] = [
  { id: 'D001', name: 'Dr. Amina Odhiambo', specialization: 'Internal Medicine', email: 'amina@medicore.ke', phone: '0712 345 678', ward: 'Ward A', status: 'active', username: 'doctor' },
  { id: 'D002', name: 'Dr. James Kariuki', specialization: 'Pediatrics', email: 'james@medicore.ke', phone: '0713 456 789', ward: 'Ward B', status: 'active', username: 'jkariuki' },
  { id: 'D003', name: 'Dr. Sarah Njeri', specialization: 'Surgery', email: 'sarah@medicore.ke', phone: '0714 567 890', ward: 'Ward C', status: 'active', username: 'snjeri' },
  { id: 'D004', name: 'Dr. Peter Mutua', specialization: 'Cardiology', email: 'peter@medicore.ke', phone: '0715 678 901', ward: 'ICU', status: 'active', username: 'pmutua' },
  { id: 'D005', name: 'Dr. Lucy Akinyi', specialization: 'Neurology', email: 'lucy@medicore.ke', phone: '0716 789 012', ward: 'Ward A', status: 'inactive', username: 'lakinyi' },
];

export const nurses: Nurse[] = [
  { id: 'N001', name: 'Patricia Wanjiku', ward: 'Ward A', shift: 'Morning', status: 'active', email: 'patricia@medicore.ke' },
  { id: 'N002', name: 'Kevin Otieno', ward: 'Ward B', shift: 'Evening', status: 'active', email: 'kevin@medicore.ke' },
  { id: 'N003', name: 'Mary Chebet', ward: 'ICU', shift: 'Night', status: 'active', email: 'mary@medicore.ke' },
  { id: 'N004', name: 'John Mwenda', ward: 'Ward C', shift: 'Morning', status: 'active', email: 'john@medicore.ke' },
];

export const patients: Patient[] = [
  { id: 'P001', name: 'Brian Mwangi', age: 34, gender: 'Male', bloodType: 'O+', diagnosis: 'Malaria', ward: 'Ward A', assignedDoctor: 'Dr. Amina Odhiambo', admissionDate: '2025-04-01', status: 'admitted', contact: '0722 111 222', email: 'brian@email.com', emergencyContact: 'Jane Mwangi', emergencyPhone: '0733 111 222', insuranceProvider: 'NHIF', policyNumber: 'NHF-2025-001', insuranceExpiry: '2026-12-31' },
  { id: 'P002', name: 'Cynthia Achieng', age: 28, gender: 'Female', bloodType: 'A+', diagnosis: 'Typhoid', ward: 'Ward B', assignedDoctor: 'Dr. James Kariuki', admissionDate: '2025-04-03', status: 'admitted', contact: '0722 222 333', email: 'cynthia@email.com', emergencyContact: 'Paul Achieng', emergencyPhone: '0733 222 333', insuranceProvider: 'Jubilee', policyNumber: 'JUB-2025-045', insuranceExpiry: '2025-11-30' },
  { id: 'P003', name: 'David Kamau', age: 52, gender: 'Male', bloodType: 'B+', diagnosis: 'Hypertension', ward: 'Ward A', assignedDoctor: 'Dr. Amina Odhiambo', admissionDate: '2025-03-28', status: 'admitted', contact: '0722 333 444', email: 'david@email.com', emergencyContact: 'Ann Kamau', emergencyPhone: '0733 333 444', insuranceProvider: 'AAR', policyNumber: 'AAR-2025-112', insuranceExpiry: '2026-06-15' },
  { id: 'P004', name: 'Faith Wambui', age: 45, gender: 'Female', bloodType: 'AB+', diagnosis: 'Diabetes Type 2', ward: 'Ward C', assignedDoctor: 'Dr. Sarah Njeri', admissionDate: '2025-04-05', status: 'admitted', contact: '0722 444 555', email: 'faith@email.com', emergencyContact: 'Tom Wambui', emergencyPhone: '0733 444 555', insuranceProvider: 'NHIF', policyNumber: 'NHF-2025-078', insuranceExpiry: '2026-08-20' },
  { id: 'P005', name: 'George Onyango', age: 61, gender: 'Male', bloodType: 'O-', diagnosis: 'Pneumonia', ward: 'ICU', assignedDoctor: 'Dr. Peter Mutua', admissionDate: '2025-04-07', status: 'admitted', contact: '0722 555 666', email: 'george@email.com', emergencyContact: 'Mary Onyango', emergencyPhone: '0733 555 666', insuranceProvider: 'Britam', policyNumber: 'BRT-2025-033', insuranceExpiry: '2025-10-01' },
  { id: 'P006', name: 'Hilda Mutiso', age: 19, gender: 'Female', bloodType: 'A-', diagnosis: 'Malaria', ward: 'Ward A', assignedDoctor: 'Dr. Amina Odhiambo', admissionDate: '2025-04-09', status: 'admitted', contact: '0722 666 777', email: 'hilda@email.com', emergencyContact: 'Susan Mutiso', emergencyPhone: '0733 666 777', insuranceProvider: 'NHIF', policyNumber: 'NHF-2025-156', insuranceExpiry: '2026-03-15' },
];

export const appointments: Appointment[] = [
  { id: 'A001', patient: 'Brian Mwangi', doctor: 'Dr. Amina Odhiambo', date: '2025-04-12', time: '09:00', reason: 'Follow-up', department: 'Internal Medicine', status: 'confirmed' },
  { id: 'A002', patient: 'Cynthia Achieng', doctor: 'Dr. James Kariuki', date: '2025-04-12', time: '10:30', reason: 'Lab Review', department: 'Pediatrics', status: 'pending' },
  { id: 'A003', patient: 'David Kamau', doctor: 'Dr. Amina Odhiambo', date: '2025-04-13', time: '14:00', reason: 'BP Check', department: 'Internal Medicine', status: 'confirmed' },
  { id: 'A004', patient: 'Faith Wambui', doctor: 'Dr. Sarah Njeri', date: '2025-04-14', time: '11:00', reason: 'Surgical Consult', department: 'Surgery', status: 'pending' },
  { id: 'A005', patient: 'George Onyango', doctor: 'Dr. Peter Mutua', date: '2025-04-15', time: '08:30', reason: 'ICU Review', department: 'Cardiology', status: 'confirmed' },
  { id: 'A006', patient: 'Hilda Mutiso', doctor: 'Dr. Amina Odhiambo', date: '2025-04-16', time: '15:00', reason: 'Discharge Review', department: 'Internal Medicine', status: 'completed' },
];

export const labTests: LabTest[] = [
  { id: 'T001', patient: 'Brian Mwangi', doctor: 'Dr. Amina Odhiambo', testType: 'Malaria RDT', urgency: 'STAT', dateRequested: '2025-04-10', status: 'pending', result: null, referenceRange: 'Negative' },
  { id: 'T002', patient: 'Cynthia Achieng', doctor: 'Dr. James Kariuki', testType: 'CBC', urgency: 'Routine', dateRequested: '2025-04-09', dateCompleted: '2025-04-10', status: 'completed', result: 'Hgb: 11.2 g/dL — Abnormal', flag: 'abnormal', technician: 'Grace Muthoni', referenceRange: 'Hgb: 12.0-16.0 g/dL' },
  { id: 'T003', patient: 'David Kamau', doctor: 'Dr. Amina Odhiambo', testType: 'Blood Glucose', urgency: 'Routine', dateRequested: '2025-04-10', status: 'in-progress', result: null, referenceRange: 'Fasting: 70-100 mg/dL' },
  { id: 'T004', patient: 'Faith Wambui', doctor: 'Dr. Sarah Njeri', testType: 'Urinalysis', urgency: 'Routine', dateRequested: '2025-04-08', dateCompleted: '2025-04-09', status: 'completed', result: 'pH: 6.0, Protein: Negative', flag: 'normal', technician: 'Samuel Kiprop', referenceRange: 'pH: 4.5-8.0' },
  { id: 'T005', patient: 'George Onyango', doctor: 'Dr. Peter Mutua', testType: 'Chest X-Ray', urgency: 'STAT', dateRequested: '2025-04-11', status: 'pending', result: null, referenceRange: 'Clear lung fields' },
];

export const labTechnicians: LabTechnician[] = [
  { id: 'L001', name: 'Grace Muthoni', email: 'grace@medicore.ke', status: 'active', phone: '0717 111 222' },
  { id: 'L002', name: 'Samuel Kiprop', email: 'samuel@medicore.ke', status: 'active', phone: '0717 222 333' },
  { id: 'L003', name: 'Irene Waweru', email: 'irene@medicore.ke', status: 'inactive', phone: '0717 333 444' },
];

export const prescriptions: Prescription[] = [
  { id: 'RX001', patient: 'Brian Mwangi', doctor: 'Dr. Amina Odhiambo', medication: 'Artemether-Lumefantrine', dosage: '80/480mg', frequency: 'Twice daily', startDate: '2025-04-01', endDate: '2025-04-04', instructions: 'Take with fatty food', status: 'completed' },
  { id: 'RX002', patient: 'David Kamau', doctor: 'Dr. Amina Odhiambo', medication: 'Amlodipine', dosage: '5mg', frequency: 'Once daily', startDate: '2025-03-28', endDate: '2025-06-28', instructions: 'Take in the morning', status: 'active' },
  { id: 'RX003', patient: 'Faith Wambui', doctor: 'Dr. Sarah Njeri', medication: 'Metformin', dosage: '500mg', frequency: 'Twice daily', startDate: '2025-04-05', endDate: '2025-10-05', instructions: 'Take with meals', status: 'active' },
  { id: 'RX004', patient: 'Hilda Mutiso', doctor: 'Dr. Amina Odhiambo', medication: 'Artesunate', dosage: '200mg', frequency: 'Once daily', startDate: '2025-04-09', endDate: '2025-04-12', instructions: 'IV route, switch to oral when able', status: 'active' },
  { id: 'RX005', patient: 'George Onyango', doctor: 'Dr. Peter Mutua', medication: 'Amoxicillin-Clavulanate', dosage: '625mg', frequency: 'Three times daily', startDate: '2025-04-07', endDate: '2025-04-17', instructions: 'Complete full course', status: 'active' },
];

export const vitals: Vitals[] = [
  { patientId: 'P001', bp: '120/80', hr: 72, temp: 36.8, spo2: 98, rr: 16, weight: 70, timestamp: '2025-04-11 08:00' },
  { patientId: 'P001', bp: '118/78', hr: 74, temp: 36.9, spo2: 97, rr: 17, weight: 70, timestamp: '2025-04-10 08:00' },
  { patientId: 'P001', bp: '125/82', hr: 78, temp: 37.2, spo2: 96, rr: 18, weight: 70, timestamp: '2025-04-09 08:00' },
  { patientId: 'P001', bp: '130/85', hr: 82, temp: 37.8, spo2: 95, rr: 20, weight: 70, timestamp: '2025-04-08 08:00' },
  { patientId: 'P001', bp: '128/84', hr: 80, temp: 37.5, spo2: 96, rr: 19, weight: 70, timestamp: '2025-04-07 08:00' },
  { patientId: 'P001', bp: '132/86', hr: 85, temp: 38.0, spo2: 94, rr: 22, weight: 70, timestamp: '2025-04-06 08:00' },
  { patientId: 'P001', bp: '135/88', hr: 88, temp: 38.5, spo2: 93, rr: 24, weight: 70, timestamp: '2025-04-05 08:00' },
  { patientId: 'P002', bp: '110/70', hr: 68, temp: 37.0, spo2: 99, rr: 15, weight: 58, timestamp: '2025-04-11 08:00' },
  { patientId: 'P003', bp: '145/95', hr: 76, temp: 36.7, spo2: 98, rr: 16, weight: 82, timestamp: '2025-04-11 08:00' },
  { patientId: 'P004', bp: '130/82', hr: 70, temp: 36.6, spo2: 98, rr: 15, weight: 75, timestamp: '2025-04-11 08:00' },
  { patientId: 'P005', bp: '140/90', hr: 92, temp: 38.2, spo2: 91, rr: 26, weight: 78, timestamp: '2025-04-11 08:00' },
  { patientId: 'P006', bp: '115/75', hr: 80, temp: 37.6, spo2: 97, rr: 18, weight: 55, timestamp: '2025-04-11 08:00' },
];

export const inventory: InventoryItem[] = [
  { id: 'INV001', name: 'Malaria RDT Kits', category: 'Diagnostics', quantity: 245, unit: 'Tests', reorderLevel: 100, status: 'In Stock' },
  { id: 'INV002', name: 'CBC Reagent', category: 'Hematology', quantity: 34, unit: 'Bottles', reorderLevel: 50, status: 'Low' },
  { id: 'INV003', name: 'Glucose Strips', category: 'Chemistry', quantity: 500, unit: 'Strips', reorderLevel: 200, status: 'In Stock' },
  { id: 'INV004', name: 'Urinalysis Strips', category: 'Chemistry', quantity: 0, unit: 'Strips', reorderLevel: 150, status: 'Out of Stock' },
  { id: 'INV005', name: 'X-Ray Film', category: 'Radiology', quantity: 89, unit: 'Sheets', reorderLevel: 50, status: 'In Stock' },
];

export const billing: BillingItem[] = [
  { id: 'B001', patient: 'Brian Mwangi', service: 'Consultation - Internal Medicine', date: '2025-04-01', amount: 2500, status: 'Paid' },
  { id: 'B002', patient: 'Brian Mwangi', service: 'Malaria RDT Test', date: '2025-04-01', amount: 1500, status: 'Paid' },
  { id: 'B003', patient: 'Brian Mwangi', service: 'Ward Bed - Ward A (7 days)', date: '2025-04-08', amount: 3500, status: 'Pending' },
  { id: 'B004', patient: 'Brian Mwangi', service: 'Medication - Artemether-Lumefantrine', date: '2025-04-01', amount: 800, status: 'Paid' },
  { id: 'B005', patient: 'Brian Mwangi', service: 'Follow-up Consultation', date: '2025-04-12', amount: 1200, status: 'Pending' },
];

export const nurseTasks: NurseTask[] = [
  { id: 'NT001', patient: 'Brian Mwangi', description: 'Record morning vitals', dueTime: '08:00', priority: 'High', column: 'done', assignedNurse: 'Patricia Wanjiku' },
  { id: 'NT002', patient: 'David Kamau', description: 'Administer BP medication', dueTime: '09:00', priority: 'High', column: 'inprogress', assignedNurse: 'Patricia Wanjiku' },
  { id: 'NT003', patient: 'Hilda Mutiso', description: 'Change IV fluid bag', dueTime: '10:00', priority: 'Medium', column: 'todo', assignedNurse: 'Patricia Wanjiku' },
  { id: 'NT004', patient: 'Brian Mwangi', description: 'Update patient chart', dueTime: '11:00', priority: 'Low', column: 'todo', assignedNurse: 'Patricia Wanjiku' },
  { id: 'NT005', patient: 'David Kamau', description: 'Prepare for doctor rounds', dueTime: '13:00', priority: 'Medium', column: 'todo', assignedNurse: 'Patricia Wanjiku' },
  { id: 'NT006', patient: 'Hilda Mutiso', description: 'Check wound dressing', dueTime: '14:00', priority: 'High', column: 'inprogress', assignedNurse: 'Patricia Wanjiku' },
  { id: 'NT007', patient: 'Brian Mwangi', description: 'Record evening vitals', dueTime: '18:00', priority: 'High', column: 'todo', assignedNurse: 'Patricia Wanjiku' },
];

export const medicationAdmin: MedicationAdmin[] = [
  { id: 'MA001', patient: 'Brian Mwangi', medication: 'Artemether-Lumefantrine', dose: '80/480mg', timeDue: '08:00', administered: true, administeredAt: '2025-04-11 08:05', administeredBy: 'Patricia Wanjiku', notes: '' },
  { id: 'MA002', patient: 'Brian Mwangi', medication: 'Artemether-Lumefantrine', dose: '80/480mg', timeDue: '20:00', administered: false, administeredAt: null, administeredBy: null, notes: '' },
  { id: 'MA003', patient: 'David Kamau', medication: 'Amlodipine', dose: '5mg', timeDue: '08:00', administered: true, administeredAt: '2025-04-11 08:10', administeredBy: 'Patricia Wanjiku', notes: '' },
  { id: 'MA004', patient: 'Faith Wambui', medication: 'Metformin', dose: '500mg', timeDue: '08:00', administered: false, administeredAt: null, administeredBy: null, notes: 'Patient was fasting for lab test' },
  { id: 'MA005', patient: 'Faith Wambui', medication: 'Metformin', dose: '500mg', timeDue: '20:00', administered: false, administeredAt: null, administeredBy: null, notes: '' },
  { id: 'MA006', patient: 'Hilda Mutiso', medication: 'Artesunate', dose: '200mg', timeDue: '10:00', administered: false, administeredAt: null, administeredBy: null, notes: 'IV administration' },
  { id: 'MA007', patient: 'George Onyango', medication: 'Amoxicillin-Clavulanate', dose: '625mg', timeDue: '08:00', administered: true, administeredAt: '2025-04-11 08:15', administeredBy: 'Mary Chebet', notes: '' },
  { id: 'MA008', patient: 'George Onyango', medication: 'Amoxicillin-Clavulanate', dose: '625mg', timeDue: '14:00', administered: false, administeredAt: null, administeredBy: null, notes: '' },
  { id: 'MA009', patient: 'George Onyango', medication: 'Amoxicillin-Clavulanate', dose: '625mg', timeDue: '20:00', administered: false, administeredAt: null, administeredBy: null, notes: '' },
  { id: 'MA010', patient: 'David Kamau', medication: 'Losartan', dose: '50mg', timeDue: '08:00', administered: false, administeredAt: null, administeredBy: null, notes: '' },
  { id: 'MA011', patient: 'Brian Mwangi', medication: 'Paracetamol', dose: '1g', timeDue: '12:00', administered: false, administeredAt: null, administeredBy: null, notes: '' },
  { id: 'MA012', patient: 'Hilda Mutiso', medication: 'Metoclopramide', dose: '10mg', timeDue: '12:00', administered: false, administeredAt: null, administeredBy: null, notes: '' },
];

export const nurseActivities: ActivityEntry[] = [
  { id: 'ACT001', icon: 'vitals', description: 'Recorded morning vitals for Brian Mwangi', patient: 'Brian Mwangi', timestamp: '2025-04-11 08:00', date: '2025-04-11' },
  { id: 'ACT002', icon: 'meds', description: 'Administered Artemether-Lumefantrine to Brian Mwangi', patient: 'Brian Mwangi', timestamp: '2025-04-11 08:05', date: '2025-04-11' },
  { id: 'ACT003', icon: 'meds', description: 'Administered Amlodipine to David Kamau', patient: 'David Kamau', timestamp: '2025-04-11 08:10', date: '2025-04-11' },
  { id: 'ACT004', icon: 'meds', description: 'Administered Amoxicillin-Clavulanate to George Onyango', patient: 'George Onyango', timestamp: '2025-04-11 08:15', date: '2025-04-11' },
  { id: 'ACT005', icon: 'task', description: 'Completed patient chart update for Brian Mwangi', patient: 'Brian Mwangi', timestamp: '2025-04-11 09:00', date: '2025-04-11' },
  { id: 'ACT006', icon: 'vitals', description: 'Recorded vitals for Cynthia Achieng', patient: 'Cynthia Achieng', timestamp: '2025-04-11 09:30', date: '2025-04-11' },
  { id: 'ACT007', icon: 'task', description: 'Changed IV fluid bag for Hilda Mutiso', patient: 'Hilda Mutiso', timestamp: '2025-04-10 14:00', date: '2025-04-10' },
  { id: 'ACT008', icon: 'meds', description: 'Administered evening medication to all Ward A patients', patient: 'Ward A', timestamp: '2025-04-10 20:00', date: '2025-04-10' },
  { id: 'ACT009', icon: 'vitals', description: 'Recorded evening vitals for David Kamau', patient: 'David Kamau', timestamp: '2025-04-10 18:00', date: '2025-04-10' },
  { id: 'ACT010', icon: 'general', description: 'Shift handover completed — Morning to Evening', patient: 'N/A', timestamp: '2025-04-10 14:00', date: '2025-04-10' },
];

export const doctorNotes: DoctorNote[] = [
  { id: 'DN001', patientId: 'P001', patient: 'Brian Mwangi', doctor: 'Dr. Amina Odhiambo', date: '2025-04-11', content: 'Patient showing improvement. Fever down from 38.5 to 36.8. Malaria parasite count reducing. Continue current medication regimen. Plan to discharge in 2 days if vitals remain stable.', isPrivate: false },
  { id: 'DN002', patientId: 'P003', patient: 'David Kamau', doctor: 'Dr. Amina Odhiambo', date: '2025-04-10', content: 'Blood pressure remains elevated at 145/95 despite medication. Consider increasing Amlodipine dosage to 10mg or adding Losartan 50mg. Renal function test ordered.', isPrivate: false },
  { id: 'DN003', patientId: 'P006', patient: 'Hilda Mutiso', doctor: 'Dr. Amina Odhiambo', date: '2025-04-09', content: 'Young patient with severe malaria. Started on IV Artesunate. Monitor closely for complications. Family counseling done regarding treatment plan.', isPrivate: true },
  { id: 'DN004', patientId: 'P001', patient: 'Brian Mwangi', doctor: 'Dr. Amina Odhiambo', date: '2025-04-08', content: 'Patient admitted with high-grade fever, chills and rigors. Malaria RDT positive. Started on Artemether-Lumefantrine. IV fluids running. Will monitor response to treatment.', isPrivate: false },
  { id: 'DN005', patientId: 'P003', patient: 'David Kamau', doctor: 'Dr. Amina Odhiambo', date: '2025-04-05', content: 'Follow-up on hypertension management. Patient reports compliance with medication but still experiencing headaches. ECG normal. Will continue monitoring.', isPrivate: false },
];

export const wards: Ward[] = [
  {
    name: 'Ward A', totalBeds: 24, occupied: 14, available: 10,
    beds: Array.from({ length: 24 }, (_, i) => ({
      number: `A${(i + 1).toString().padStart(2, '0')}`,
      status: i < 8 ? 'occupied' as const : i < 10 ? 'reserved' as const : 'available' as const,
      patient: i < 8 ? ['Brian Mwangi', 'David Kamau', 'Hilda Mutiso', 'Anne Wangari', 'Joseph Oloo', 'Ruth Nyambura', 'James Kipchoge', 'Mary Wairimu'][i] : undefined,
    })),
  },
  {
    name: 'Ward B', totalBeds: 20, occupied: 12, available: 8,
    beds: Array.from({ length: 20 }, (_, i) => ({
      number: `B${(i + 1).toString().padStart(2, '0')}`,
      status: i < 10 ? 'occupied' as const : i < 12 ? 'reserved' as const : 'available' as const,
      patient: i < 10 ? ['Cynthia Achieng', 'Peter Njenga', 'Alice Mwikali', 'Daniel Kiptoo', 'Sarah Atieno', 'Mark Ouma', 'Lucy Njoki', 'Stephen Kibet', 'Grace Adhiambo', 'Tom Maina'][i] : undefined,
    })),
  },
  {
    name: 'Ward C', totalBeds: 18, occupied: 8, available: 10,
    beds: Array.from({ length: 18 }, (_, i) => ({
      number: `C${(i + 1).toString().padStart(2, '0')}`,
      status: i < 6 ? 'occupied' as const : i < 8 ? 'reserved' as const : 'available' as const,
      patient: i < 6 ? ['Faith Wambui', 'John Kamande', 'Elizabeth Wanjala', 'Paul Mwendwa', 'Hannah Cherop', 'Samuel Otieno'][i] : undefined,
    })),
  },
  {
    name: 'ICU', totalBeds: 8, occupied: 5, available: 3,
    beds: Array.from({ length: 8 }, (_, i) => ({
      number: `ICU${(i + 1).toString().padStart(2, '0')}`,
      status: i < 4 ? 'occupied' as const : i < 5 ? 'reserved' as const : 'available' as const,
      patient: i < 4 ? ['George Onyango', 'Catherine Wekesa', 'Michael Rotich', 'Agnes Nyaguthii'][i] : undefined,
    })),
  },
];

export const recentAdminActivities = [
  { id: 1, icon: 'general', description: 'Dr. Kariuki admitted Brian Mwangi', time: '2h ago' },
  { id: 2, icon: 'meds', description: 'Prescription issued for David Kamau', time: '3h ago' },
  { id: 3, icon: 'vitals', description: 'Nurse Patricia recorded vitals for Ward A', time: '4h ago' },
  { id: 4, icon: 'task', description: 'Lab result uploaded for Cynthia Achieng', time: '5h ago' },
  { id: 5, icon: 'general', description: 'New appointment scheduled — Faith Wambui', time: '6h ago' },
  { id: 6, icon: 'meds', description: 'Medication administered to George Onyango', time: '7h ago' },
  { id: 7, icon: 'general', description: 'Dr. Njeri completed surgical consult', time: '8h ago' },
  { id: 8, icon: 'vitals', description: 'ICU vitals update — George Onyango stable', time: '9h ago' },
];

export const monthlyAdmissions = [
  { label: 'Jan', value: 45 }, { label: 'Feb', value: 38 }, { label: 'Mar', value: 52 },
  { label: 'Apr', value: 41 }, { label: 'May', value: 55 }, { label: 'Jun', value: 48 },
  { label: 'Jul', value: 62 }, { label: 'Aug', value: 58 }, { label: 'Sep', value: 44 },
  { label: 'Oct', value: 50 }, { label: 'Nov', value: 47 }, { label: 'Dec', value: 53 },
];

export const vitalsHistory = [
  { label: 'Apr 5', value: 88 }, { label: 'Apr 6', value: 85 },
  { label: 'Apr 7', value: 80 }, { label: 'Apr 8', value: 82 },
  { label: 'Apr 9', value: 78 }, { label: 'Apr 10', value: 74 },
  { label: 'Apr 11', value: 72 },
];
