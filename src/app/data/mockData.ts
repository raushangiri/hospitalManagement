// ── Patients ─────────────────────────────────────────────────────────────────
export const patients = [
  { id: "PT001", uhid: "MF-284801", name: "Ramesh Gupta",     age: 52, gender: "M", mobile: "9876543210", blood: "B+", diagnosis: "Hypertensive Heart Disease", doctor: "Dr. Rajesh Sharma", ward: "ICU", bed: "Bed 4",  allergy: "Penicillin" },
  { id: "PT002", uhid: "MF-284802", name: "Sunita Devi",      age: 38, gender: "F", mobile: "9812345678", blood: "O+", diagnosis: "Hypothyroidism",             doctor: "Dr. Priya Mehta",   ward: "Ward A", bed: "Bed 7", allergy: "None" },
  { id: "PT003", uhid: "MF-284803", name: "Arjun Mehta",      age: 29, gender: "M", mobile: "9834567890", blood: "A+", diagnosis: "Post PTCA follow-up",         doctor: "Dr. Rajesh Sharma", ward: "Ward A", bed: "Bed 3",  allergy: "Aspirin" },
  { id: "PT004", uhid: "MF-284804", name: "Kavya Sharma",     age: 45, gender: "F", mobile: "9856789012", blood: "AB-", diagnosis: "Palpitations – investigation", doctor: "Dr. Rajesh Sharma", ward: "OPD",    bed: "-",     allergy: "None" },
  { id: "PT005", uhid: "MF-284805", name: "Mohan Lal",        age: 65, gender: "M", mobile: "9878901234", blood: "O-", diagnosis: "DM + Ischaemic heart disease", doctor: "Dr. Rajesh Sharma", ward: "Ward B", bed: "Bed 2",  allergy: "Sulfa" },
  { id: "PT006", uhid: "MF-284806", name: "Priya Nair",       age: 31, gender: "F", mobile: "9890123456", blood: "A-", diagnosis: "Pregnancy – 28 weeks",         doctor: "Dr. Sunita Patel",  ward: "Maternity", bed: "Bed 6", allergy: "None" },
  { id: "PT007", uhid: "MF-284807", name: "Ravi Kumar",       age: 47, gender: "M", mobile: "9801234567", blood: "B-", diagnosis: "Lumbar disc prolapse",         doctor: "Dr. Arun Kumar",    ward: "Surgical", bed: "Bed 3", allergy: "None" },
  { id: "PT008", uhid: "MF-284808", name: "Anita Singh",      age: 55, gender: "F", mobile: "9823456789", blood: "AB+", diagnosis: "Stroke – CVA",               doctor: "Dr. Priya Mehta",   ward: "ICU",    bed: "Bed 2",  allergy: "Ibuprofen" },
];

// ── OPD Queue ─────────────────────────────────────────────────────────────────
export const opdQueue = [
  { token: "T-01", patientId: "PT001", name: "Ramesh Gupta",  age: 52, issue: "Chest pain & breathlessness", status: "In Consultation", urgent: true  },
  { token: "T-02", patientId: "PT002", name: "Sunita Devi",   age: 38, issue: "Routine thyroid check",       status: "Waiting",         urgent: false },
  { token: "T-03", patientId: "PT003", name: "Arjun Mehta",   age: 29, issue: "Follow-up post angioplasty",  status: "Waiting",         urgent: false },
  { token: "T-04", patientId: "PT004", name: "Kavya Sharma",  age: 45, issue: "Palpitations since 2 days",   status: "Waiting",         urgent: true  },
  { token: "T-05", patientId: "PT005", name: "Mohan Lal",     age: 65, issue: "DM + cardiac review",         status: "Waiting",         urgent: false },
  { token: "T-06", patientId: "PT006", name: "Priya Nair",    age: 31, issue: "Antenatal checkup",           status: "Waiting",         urgent: false },
  { token: "T-07", patientId: "PT007", name: "Vikash Modi",   age: 40, issue: "Back pain radiating to legs", status: "Waiting",         urgent: false },
  { token: "T-08", patientId: "PT008", name: "Neha Kapoor",   age: 28, issue: "ECG abnormality found",       status: "Waiting",         urgent: true  },
];

// ── Medicines database ────────────────────────────────────────────────────────
export const medicines = [
  { name: "Tab Metoprolol",     dose: "50mg",    freq: "Twice daily", duration: "30 days", route: "Oral", instructions: "After food" },
  { name: "Tab Aspirin",        dose: "75mg",    freq: "Once daily",  duration: "30 days", route: "Oral", instructions: "Morning after food" },
  { name: "Tab Atorvastatin",   dose: "40mg",    freq: "Once daily",  duration: "30 days", route: "Oral", instructions: "At bedtime" },
  { name: "Tab Amlodipine",     dose: "5mg",     freq: "Once daily",  duration: "30 days", route: "Oral", instructions: "Morning" },
  { name: "Tab Ramipril",       dose: "2.5mg",   freq: "Once daily",  duration: "30 days", route: "Oral", instructions: "Morning" },
  { name: "Tab Metformin",      dose: "500mg",   freq: "Twice daily", duration: "30 days", route: "Oral", instructions: "After meals" },
  { name: "Tab Glimepiride",    dose: "1mg",     freq: "Once daily",  duration: "30 days", route: "Oral", instructions: "Before breakfast" },
  { name: "Inj Insulin Glargine",dose:"10 units","freq": "Once daily",duration: "30 days", route: "SC",   instructions: "Bedtime" },
  { name: "Tab Levothyroxine",  dose: "50mcg",   freq: "Once daily",  duration: "30 days", route: "Oral", instructions: "Empty stomach" },
  { name: "Tab Pantoprazole",   dose: "40mg",    freq: "Once daily",  duration: "14 days", route: "Oral", instructions: "30 min before breakfast" },
  { name: "Tab Cetirizine",     dose: "10mg",    freq: "Once daily",  duration: "7 days",  route: "Oral", instructions: "At bedtime" },
  { name: "Tab Amoxicillin",    dose: "500mg",   freq: "Thrice daily",duration: "7 days",  route: "Oral", instructions: "After food" },
  { name: "Cap Azithromycin",   dose: "500mg",   freq: "Once daily",  duration: "5 days",  route: "Oral", instructions: "After food" },
  { name: "Tab Diclofenac",     dose: "50mg",    freq: "Twice daily", duration: "5 days",  route: "Oral", instructions: "After food" },
  { name: "Tab Paracetamol",    dose: "500mg",   freq: "SOS (if fever/pain)", duration: "5 days", route: "Oral", instructions: "With water" },
  { name: "Syr Lactulose",      dose: "15ml",    freq: "At bedtime",  duration: "14 days", route: "Oral", instructions: "With water" },
  { name: "Inj Enoxaparin",     dose: "40mg",    freq: "Once daily",  duration: "7 days",  route: "SC",   instructions: "Abdomen injection" },
  { name: "Tab Clopidogrel",    dose: "75mg",    freq: "Once daily",  duration: "30 days", route: "Oral", instructions: "After food" },
  { name: "Tab Furosemide",     dose: "40mg",    freq: "Once daily",  duration: "7 days",  route: "Oral", instructions: "Morning" },
  { name: "Tab Spironolactone", dose: "25mg",    freq: "Once daily",  duration: "30 days", route: "Oral", instructions: "With food" },
  { name: "Inj Ceftriaxone",    dose: "1g",      freq: "Once daily",  duration: "5 days",  route: "IV",   instructions: "Slow IV over 30 min" },
  { name: "Tab Bisoprolol",     dose: "5mg",     freq: "Once daily",  duration: "30 days", route: "Oral", instructions: "Morning" },
];

// ── Lab Tests ─────────────────────────────────────────────────────────────────
export const labTestQueue = [
  { sampleId: "SMP-8801", patientId: "PT001", patient: "Ramesh Gupta",  ward: "ICU",    tests: ["CBC","LFT","RFT","Troponin I"],           priority: "STAT",    collected: "08:30", status: "Processing", collectedBy: "Nurse Asha" },
  { sampleId: "SMP-8802", patientId: "PT002", patient: "Sunita Devi",   ward: "OPD",    tests: ["Thyroid Profile T3/T4/TSH","HbA1c"],       priority: "Routine", collected: "09:00", status: "Received",   collectedBy: "Lab Tech Raj" },
  { sampleId: "SMP-8803", patientId: "PT003", patient: "Arjun Mehta",   ward: "Ward A", tests: ["Troponin I","D-Dimer","CK-MB","CBC"],       priority: "STAT",    collected: "09:15", status: "Processing", collectedBy: "Nurse Asha" },
  { sampleId: "SMP-8804", patientId: "PT004", patient: "Kavya Sharma",  ward: "OPD",    tests: ["Holter ECG","Echocardiography"],            priority: "Urgent",  collected: "09:30", status: "Received",   collectedBy: "Lab Tech Priya" },
  { sampleId: "SMP-8805", patientId: "PT005", patient: "Mohan Lal",     ward: "Ward B", tests: ["FBS","PPBS","HbA1c","Lipid Profile"],       priority: "Routine", collected: "10:00", status: "Received",   collectedBy: "Lab Tech Raj" },
  { sampleId: "SMP-8806", patientId: "PT006", patient: "Priya Nair",    ward: "Maternity", tests: ["CBC","Urine R/M","Blood Group & Rh"],    priority: "Routine", collected: "10:15", status: "Completed",  collectedBy: "Nurse Sunita" },
  { sampleId: "SMP-8807", patientId: "PT007", patient: "Ravi Kumar",    ward: "Surgical", tests: ["CBC","PT/INR","Blood Cross-match"],        priority: "Urgent",  collected: "10:30", status: "Received",   collectedBy: "Lab Tech Priya" },
];

export const reportsReady = [
  { reportId: "RPT-1101", patient: "Ramesh Gupta",  test: "CBC + LFT", date: "Today 11:30", doctor: "Dr. Sharma", status: "Ready", critical: true  },
  { reportId: "RPT-1102", patient: "Sunita Devi",   test: "Thyroid Profile", date: "Today 11:00", doctor: "Dr. Mehta", status: "Ready", critical: false },
  { reportId: "RPT-1103", patient: "Priya Nair",    test: "CBC + Urine R/M", date: "Today 10:45", doctor: "Dr. Patel", status: "Ready", critical: false },
  { reportId: "RPT-1104", patient: "Mohan Lal",     test: "HbA1c + Lipid", date: "Today 10:00", doctor: "Dr. Sharma", status: "Ready", critical: false },
  { reportId: "RPT-1105", patient: "Anita Singh",   test: "MRI Brain",    date: "Today 09:30", doctor: "Dr. Mehta", status: "Ready", critical: true  },
  { reportId: "RPT-1106", patient: "Kavya Sharma",  test: "Echocardiography", date: "Today 09:00", doctor: "Dr. Sharma", status: "Ready", critical: false },
  { reportId: "RPT-1107", patient: "Vikash Modi",   test: "MRI Lumbar Spine", date: "Today 08:30", doctor: "Dr. Kumar", status: "Ready", critical: false },
];

export const criticalValues = [
  { patient: "Ramesh Gupta",  ward: "ICU Bed 4",   test: "Troponin I",  value: "8.4 ng/mL",  normal: "< 0.04",  severity: "CRITICAL HIGH", alerted: false },
  { patient: "ICU Bed 12",    ward: "ICU",         test: "Potassium",   value: "6.8 mEq/L",  normal: "3.5–5.0", severity: "CRITICAL HIGH", alerted: false },
  { patient: "Mohan Lal",     ward: "Ward B Bed 2",test: "Blood Glucose",value: "42 mg/dL",  normal: "70–110",  severity: "CRITICAL LOW",  alerted: true  },
];

// ── Pharmacy / Inventory ──────────────────────────────────────────────────────
export const inventory = [
  { id: "MED001", name: "Tab Metoprolol 50mg",   category: "Cardiac",    qty: 850,  min: 200, batch: "B2024-12", expiry: "Dec 2026", unit: "Strip", rate: 8.50  },
  { id: "MED002", name: "Tab Aspirin 75mg",       category: "Cardiac",    qty: 1200, min: 300, batch: "B2024-11", expiry: "Nov 2026", unit: "Strip", rate: 3.20  },
  { id: "MED003", name: "Inj Ceftriaxone 1g",     category: "Antibiotic", qty: 12,   min: 50,  batch: "B2025-02", expiry: "Feb 2027", unit: "Vial",  rate: 85.00 },
  { id: "MED004", name: "Tab Amoxicillin 500mg",  category: "Antibiotic", qty: 48,   min: 200, batch: "B2024-09", expiry: "Sep 2026", unit: "Strip", rate: 12.50 },
  { id: "MED005", name: "Syr Paracetamol 250mg",  category: "Analgesic",  qty: 120,  min: 100, batch: "B2024-07", expiry: "Aug 2026", unit: "Bottle",rate: 35.00 },
  { id: "MED006", name: "Tab Metformin 500mg",    category: "Diabetes",   qty: 80,   min: 300, batch: "B2024-10", expiry: "Oct 2026", unit: "Strip", rate: 7.80  },
  { id: "MED007", name: "Inj Insulin Regular",    category: "Diabetes",   qty: 22,   min: 40,  batch: "B2024-08", expiry: "Jul 2026", unit: "Vial",  rate: 180.00},
  { id: "MED008", name: "Tab Atorvastatin 40mg",  category: "Cardiac",    qty: 650,  min: 200, batch: "B2025-01", expiry: "Jan 2027", unit: "Strip", rate: 15.00 },
  { id: "MED009", name: "Tab Pantoprazole 40mg",  category: "GI",         qty: 420,  min: 150, batch: "B2024-12", expiry: "Dec 2026", unit: "Strip", rate: 6.50  },
  { id: "MED010", name: "Tab Amlodipine 5mg",     category: "Cardiac",    qty: 380,  min: 200, batch: "B2025-03", expiry: "Mar 2027", unit: "Strip", rate: 5.20  },
  { id: "MED011", name: "Cap Azithromycin 500mg", category: "Antibiotic", qty: 96,   min: 100, batch: "B2024-11", expiry: "Nov 2026", unit: "Cap",   rate: 28.00 },
  { id: "MED012", name: "Tab Omeprazole 20mg",    category: "GI",         qty: 60,   min: 200, batch: "B2024-08", expiry: "Jul 2026", unit: "Strip", rate: 4.50  },
  { id: "MED013", name: "Inj Enoxaparin 40mg",    category: "Anticoag",   qty: 35,   min: 30,  batch: "B2025-01", expiry: "Jan 2027", unit: "Syringe",rate: 320.00},
  { id: "MED014", name: "Tab Levothyroxine 50mcg",category: "Thyroid",    qty: 220,  min: 100, batch: "B2024-12", expiry: "Dec 2026", unit: "Strip", rate: 9.00  },
  { id: "MED015", name: "Tab Furosemide 40mg",    category: "Diuretic",   qty: 310,  min: 100, batch: "B2025-02", expiry: "Feb 2027", unit: "Strip", rate: 3.80  },
];

// ── Billing ───────────────────────────────────────────────────────────────────
export const billingQueue = [
  { id: "INV-2841", patient: "Ramesh Gupta",  uhid: "MF-284801", dept: "IPD + ICU",      amount: 48500,  type: "Insurance", status: "Pending Approval", age: "2 days",  items: [{ desc:"ICU Charges (2 days)",qty:2,rate:8000},{desc:"Investigations",qty:1,rate:12500},{desc:"Medicines",qty:1,rate:4200},{desc:"Doctor Fees",qty:1,rate:4800}] },
  { id: "INV-2842", patient: "Sunita Devi",   uhid: "MF-284802", dept: "OPD + Lab",       amount: 3200,   type: "Cash",      status: "Ready to Bill",    age: "Today",   items: [{ desc:"OPD Consultation",qty:1,rate:800},{desc:"Lab Tests",qty:1,rate:2400}] },
  { id: "INV-2843", patient: "Arjun Mehta",   uhid: "MF-284803", dept: "Surgical + IPD",  amount: 125000, type: "Insurance", status: "TPA Review",        age: "3 days",  items: [{ desc:"Surgery Charges",qty:1,rate:75000},{desc:"IPD (3 days)",qty:3,rate:5000},{desc:"Anaesthesia",qty:1,rate:15000},{desc:"Implant",qty:1,rate:20000},{desc:"Medicines",qty:1,rate:10000}] },
  { id: "INV-2844", patient: "Kavya Sharma",  uhid: "MF-284804", dept: "Pharmacy",         amount: 5800,   type: "UPI",       status: "Ready to Bill",    age: "Today",   items: [{ desc:"Medicines",qty:1,rate:5800}] },
  { id: "INV-2845", patient: "Mohan Lal",     uhid: "MF-284805", dept: "Radiology + Lab",  amount: 8400,   type: "Card",      status: "Paid",             age: "Today",   items: [{ desc:"CT Chest",qty:1,rate:5500},{desc:"Lab Panel",qty:1,rate:2900}] },
  { id: "INV-2846", patient: "Priya Nair",    uhid: "MF-284806", dept: "Maternity IPD",    amount: 32000,  type: "Insurance", status: "Pre-auth Pending",  age: "1 day",   items: [{ desc:"Delivery charges",qty:1,rate:18000},{desc:"Room (2 days)",qty:2,rate:3500},{desc:"NICU",qty:1,rate:5000},{desc:"Medicines",qty:1,rate:5500}] },
];

export const insuranceClaims = [
  { id: "CLM-441", patient: "Ramesh Gupta",  tpa: "Star Health",    amount: 48500,  submitted: "04 Jun", status: "Pre-auth Approved", daysOpen: 1 },
  { id: "CLM-442", patient: "Anita Singh",   tpa: "HDFC ERGO",      amount: 125000, submitted: "03 Jun", status: "Claim Submitted",   daysOpen: 3 },
  { id: "CLM-443", patient: "Priya Nair",    tpa: "Bajaj Allianz",  amount: 62000,  submitted: "02 Jun", status: "Query Raised",      daysOpen: 4 },
  { id: "CLM-444", patient: "Vikash Modi",   tpa: "Max Bupa",       amount: 98000,  submitted: "30 May", status: "Settled",           daysOpen: 7 },
  { id: "CLM-445", patient: "Mohan Lal",     tpa: "United India",   amount: 44000,  submitted: "01 Jun", status: "Under Processing",  daysOpen: 5 },
];

// ── Revenue monthly data ──────────────────────────────────────────────────────
export const revenueMonthly = [
  { month: "Jan", opd: 380000, ipd: 620000, pharmacy: 180000, lab: 95000 },
  { month: "Feb", opd: 410000, ipd: 580000, pharmacy: 165000, lab: 88000 },
  { month: "Mar", opd: 450000, ipd: 700000, pharmacy: 195000, lab: 110000 },
  { month: "Apr", opd: 395000, ipd: 650000, pharmacy: 172000, lab: 98000 },
  { month: "May", opd: 480000, ipd: 750000, pharmacy: 210000, lab: 120000 },
  { month: "Jun", opd: 428000, ipd: 425000, pharmacy: 128000, lab: 72000 },
];

// ── Staff ─────────────────────────────────────────────────────────────────────
export const staffOnDuty = [
  { id: "EMP-101", name: "Dr. Rajesh Sharma",  dept: "Cardiology",   role: "Senior Consultant", shift: "Morning 08–16", status: "On Duty", mobile: "9876543210" },
  { id: "EMP-102", name: "Dr. Priya Mehta",    dept: "Neurology",    role: "Consultant",         shift: "Morning 08–16", status: "On Duty", mobile: "9812345678" },
  { id: "EMP-103", name: "Dr. Arun Kumar",     dept: "Orthopedics",  role: "Senior Consultant", shift: "Morning 08–16", status: "On Duty", mobile: "9834567890" },
  { id: "EMP-104", name: "Dr. Sunita Patel",   dept: "Gynaecology",  role: "Consultant",         shift: "Morning 08–16", status: "On Duty", mobile: "9856789012" },
  { id: "EMP-105", name: "Dr. Ritu Sharma",    dept: "Emergency",    role: "Resident",           shift: "Morning 08–16", status: "On Duty", mobile: "9878901234" },
  { id: "EMP-106", name: "Dr. Vivek Nair",     dept: "Emergency",    role: "Senior Resident",   shift: "Night 20–08",   status: "Off Duty",mobile: "9890123456" },
  { id: "EMP-107", name: "Nurse Asha Kumari",  dept: "ICU",          role: "Charge Nurse",       shift: "Morning 07–15", status: "On Duty", mobile: "9801234567" },
  { id: "EMP-108", name: "Nurse Sunita Rao",   dept: "Ward A",       role: "Staff Nurse",        shift: "Morning 07–15", status: "On Duty", mobile: "9823456789" },
  { id: "EMP-109", name: "Nurse Rekha Singh",  dept: "OPD",          role: "Staff Nurse",        shift: "Morning 07–15", status: "On Duty", mobile: "9845678901" },
  { id: "EMP-110", name: "Santosh Yadav",      dept: "Pharmacy",     role: "Pharmacist",         shift: "Morning 08–16", status: "On Duty", mobile: "9867890123" },
  { id: "EMP-111", name: "Dr. Sneha Iyer",     dept: "Laboratory",   role: "Pathologist",        shift: "Morning 08–16", status: "On Duty", mobile: "9889012345" },
  { id: "EMP-112", name: "Rajkumar Singh",     dept: "Canteen",      role: "Canteen Manager",    shift: "Morning 06–15", status: "On Duty", mobile: "9800123456" },
];

// ── Emergency Cases ───────────────────────────────────────────────────────────
export const emergencyCases = [
  { id: "EM-001", name: "Unknown Male",   age: "~45", complaint: "Chest pain – STEMI suspected", arrivalTime: "11:42", triage: "Red",    bedAssigned: "ICU Bed 5", status: "In Treatment", doctor: "Dr. Sharma" },
  { id: "EM-002", name: "Meena Devi",    age: 62,    complaint: "Altered sensorium, high BP",   arrivalTime: "11:28", triage: "Red",    bedAssigned: "ICU Bed 6", status: "Stabilising",  doctor: "Dr. Mehta"  },
  { id: "EM-003", name: "Rohan Verma",   age: 19,    complaint: "Road accident – head injury",  arrivalTime: "11:15", triage: "Orange", bedAssigned: "Emergency Bed 3", status: "Under Obs", doctor: "Dr. Kumar" },
  { id: "EM-004", name: "Fatima Begum",  age: 34,    complaint: "Severe abdominal pain",        arrivalTime: "10:58", triage: "Orange", bedAssigned: "Emergency Bed 4", status: "Awaiting CT",doctor: "Dr. Patel"  },
  { id: "EM-005", name: "Karan Singh",   age: 28,    complaint: "Allergic reaction – hives",    arrivalTime: "10:41", triage: "Yellow", bedAssigned: "Emergency Bed 7", status: "Treated",    doctor: "Dr. Ritu"   },
];

// ── Telemedicine ──────────────────────────────────────────────────────────────
export const telemedPatients = [
  { id: "TEL-001", name: "Deepak Joshi",   age: 44, scheduled: "12:00 PM", specialty: "Cardiology", reason: "Post-discharge follow-up",   status: "Waiting" },
  { id: "TEL-002", name: "Seema Patel",    age: 36, scheduled: "12:30 PM", specialty: "Cardiology", reason: "ECG review",                 status: "Waiting" },
  { id: "TEL-003", name: "Rakesh Tiwari",  age: 58, scheduled: "01:00 PM", specialty: "Cardiology", reason: "BP medication adjustment",   status: "Upcoming"},
  { id: "TEL-004", name: "Lakshmi Nair",   age: 29, scheduled: "01:30 PM", specialty: "Cardiology", reason: "Pregnancy – cardiac consult",status: "Upcoming"},
];

// ── Doctor Schedule ───────────────────────────────────────────────────────────
export const weekSchedule = [
  { day: "Mon",  slots: [{ time: "09:00–13:00", type: "OPD",     room: "Room 3",   patients: 20 },{ time: "14:00–15:00", type: "Ward Round", room: "ICU",      patients: 5  },{ time: "16:00–17:00", type: "Telemedicine",room:"Online",   patients: 4  }] },
  { day: "Tue",  slots: [{ time: "09:00–13:00", type: "OPD",     room: "Room 3",   patients: 18 },{ time: "15:00–17:00", type: "Procedure",  room: "Cath Lab", patients: 2  }] },
  { day: "Wed",  slots: [{ time: "09:00–13:00", type: "OPD",     room: "Room 3",   patients: 22 },{ time: "14:00–15:00", type: "Ward Round", room: "Ward A",   patients: 8  }] },
  { day: "Thu",  slots: [{ time: "09:00–13:00", type: "OPD",     room: "Room 3",   patients: 16 },{ time: "14:00–15:00", type: "Ward Round", room: "ICU",      patients: 5  },{ time: "16:00–18:00", type: "Surgery",    room: "OT-2",    patients: 1  }] },
  { day: "Fri",  slots: [{ time: "09:00–13:00", type: "OPD",     room: "Room 3",   patients: 24 },{ time: "15:00–16:00", type: "Telemedicine",room:"Online",   patients: 3  }] },
  { day: "Sat",  slots: [{ time: "09:00–12:00", type: "OPD",     room: "Room 3",   patients: 12 }] },
  { day: "Sun",  slots: [] },
];

// ── Follow-ups ────────────────────────────────────────────────────────────────
export const followUps = [
  { id: "FU-001", name: "Ramesh Gupta",  age: 52, lastVisit: "02 Jun", dueDate: "12 Jun", reason: "Post angioplasty review",   risk: "High",   mobile: "9876543210", status: "Due Today"  },
  { id: "FU-002", name: "Mohan Lal",     age: 65, lastVisit: "28 May", dueDate: "07 Jun", reason: "DM + HT medication review", risk: "High",   mobile: "9878901234", status: "Overdue"    },
  { id: "FU-003", name: "Sunita Devi",   age: 38, lastVisit: "01 Jun", dueDate: "15 Jun", reason: "Thyroid dose adjustment",   risk: "Medium", mobile: "9812345678", status: "Upcoming"   },
  { id: "FU-004", name: "Kavya Sharma",  age: 45, lastVisit: "04 Jun", dueDate: "18 Jun", reason: "Holter report review",      risk: "Medium", mobile: "9856789012", status: "Upcoming"   },
  { id: "FU-005", name: "Priya Nair",    age: 31, lastVisit: "03 Jun", dueDate: "10 Jun", reason: "Antenatal checkup",         risk: "Low",    mobile: "9890123456", status: "Upcoming"   },
];

// ── Canteen / Diet ─────────────────────────────────────────────────────────────
export const patientDiets = [
  { room: "ICU Bed 4",      patient: "Ramesh Gupta", diet: "Low Sodium + Cardiac",   breakfast: "Oats porridge, warm water", lunch: "Khichdi, boiled veg, 200ml milk",  dinner: "Dalia, curd",       prescribed: "Dr. Sharma" },
  { room: "ICU Bed 2",      patient: "Anita Singh",  diet: "Liquid + High Protein",  breakfast: "Fruit juice 200ml, protein shake", lunch: "Vegetable soup 300ml, glucose water", dinner: "Milk 300ml", prescribed: "Dr. Mehta"  },
  { room: "Ward A Bed 3",   patient: "Arjun Mehta",  diet: "Post-cardiac, Low Fat",  breakfast: "Brown bread 2 slices, tea", lunch: "Rice, dal, sabzi, salad",          dinner: "Roti 2, dal",       prescribed: "Dr. Sharma" },
  { room: "Ward A Bed 7",   patient: "Sunita Devi",  diet: "Normal",                 breakfast: "Idli 3, sambar, tea",       lunch: "Rice, dal, sabzi, curd, salad",    dinner: "Roti 3, sabzi",     prescribed: "Dr. Mehta"  },
  { room: "Ward B Bed 2",   patient: "Mohan Lal",    diet: "Diabetic, Low Carb",     breakfast: "Sprouts salad, boiled egg", lunch: "Multigrain roti 2, palak dal",     dinner: "Grilled chicken/paneer, salad", prescribed: "Dr. Sharma" },
  { room: "Maternity Bed 6",patient: "Priya Nair",   diet: "High Protein + Iron",    breakfast: "Dalia, dates, milk 250ml",  lunch: "Rice, dal, sabzi, curd, fruit",    dinner: "Roti 3, paneer sabzi, milk", prescribed: "Dr. Patel" },
  { room: "Surgical Bed 3", patient: "Ravi Kumar",   diet: "Post-op Soft",           breakfast: "Idli 2, soup",              lunch: "Rice congee, boiled veg",          dinner: "Khichdi",           prescribed: "Dr. Kumar"  },
];

export const canteenBilling = [
  { room: "ICU Bed 4",      patient: "Ramesh Gupta", days: 2,  ratePerDay: 350, total: 700,  status: "Pending"  },
  { room: "ICU Bed 2",      patient: "Anita Singh",  days: 4,  ratePerDay: 300, total: 1200, status: "Pending"  },
  { room: "Ward A Bed 3",   patient: "Arjun Mehta",  days: 3,  ratePerDay: 250, total: 750,  status: "Billed"   },
  { room: "Ward A Bed 7",   patient: "Sunita Devi",  days: 2,  ratePerDay: 250, total: 500,  status: "Pending"  },
  { room: "Ward B Bed 2",   patient: "Mohan Lal",    days: 5,  ratePerDay: 250, total: 1250, status: "Billed"   },
  { room: "Maternity Bed 6",patient: "Priya Nair",   days: 1,  ratePerDay: 280, total: 280,  status: "Pending"  },
];

// ── Patient Portal ─────────────────────────────────────────────────────────────
export const myAppointments = [
  { id: "APT-001", doctor: "Dr. Rajesh Sharma", dept: "Cardiology",  date: "12 Jun 2026", time: "10:00 AM", type: "OPD",   status: "Confirmed", token: "T-14", fees: 800  },
  { id: "APT-002", doctor: "Dr. Priya Mehta",   dept: "Neurology",   date: "18 Jun 2026", time: "11:30 AM", type: "Video", status: "Confirmed", token: "-",    fees: 600  },
  { id: "APT-003", doctor: "Dr. Rajesh Sharma", dept: "Cardiology",  date: "05 Jun 2026", time: "09:30 AM", type: "OPD",   status: "Completed", token: "T-08", fees: 800  },
  { id: "APT-004", doctor: "Dr. Arun Kumar",    dept: "Orthopedics", date: "22 May 2026", time: "10:30 AM", type: "OPD",   status: "Completed", token: "T-03", fees: 900  },
];

export const myLabReports = [
  { id: "RPT-A01", test: "CBC + LFT Panel",         date: "05 Jun 2026", doctor: "Dr. Sharma", status: "Ready",   critical: false, values: [{ name: "Haemoglobin", value: "13.2 g/dL", normal: "13–17", flag: "Normal" },{ name: "WBC",  value: "8200 cells/µL", normal: "4000–11000",flag:"Normal"},{ name:"Platelets",value:"2.8 L/µL",normal:"1.5–4.5 L",flag:"Normal"},{ name:"ALT",value:"38 U/L",normal:"7–45",flag:"Normal"},{ name:"AST",value:"42 U/L",normal:"10–40",flag:"High ↑"}] },
  { id: "RPT-A02", test: "ECG + Echo Report",       date: "01 Jun 2026", doctor: "Dr. Sharma", status: "Ready",   critical: false, values: [] },
  { id: "RPT-A03", test: "Thyroid Profile T3/T4",   date: "28 May 2026", doctor: "Dr. Mehta",  status: "Ready",   critical: false, values: [{ name: "TSH",  value: "5.8 mIU/L", normal: "0.4–4.0", flag: "High ↑" },{ name: "T4",value:"0.9 ng/dL",normal:"0.8–1.8",flag:"Normal"}] },
  { id: "RPT-A04", test: "Lipid Profile",           date: "15 May 2026", doctor: "Dr. Sharma", status: "Ready",   critical: false, values: [{ name: "Total Cholesterol", value: "218 mg/dL", normal: "< 200", flag: "High ↑" },{ name: "LDL",value:"142 mg/dL",normal:"< 130",flag:"High ↑"},{ name:"HDL",value:"48 mg/dL",normal:"> 40",flag:"Normal"},{ name:"Triglycerides",value:"165 mg/dL",normal:"< 150",flag:"High ↑"}] },
];

export const myPrescriptions = [
  { id: "RX-A01", date: "05 Jun 2026", doctor: "Dr. Rajesh Sharma", dept: "Cardiology", diagnosis: "Hypertensive Heart Disease", status: "Active", medicines: [{ name:"Tab Metoprolol 50mg", freq:"Twice daily after food", duration:"30 days"},{ name:"Tab Aspirin 75mg", freq:"Once daily morning",duration:"30 days"},{ name:"Tab Atorvastatin 40mg",freq:"At bedtime",duration:"30 days"},{ name:"Syr Lactulose 15ml",freq:"At bedtime",duration:"14 days"}] },
  { id: "RX-A02", date: "22 May 2026", doctor: "Dr. Arun Kumar",    dept: "Orthopedics", diagnosis: "Lumbar spondylosis",        status: "Completed", medicines: [{ name:"Tab Diclofenac 50mg",freq:"Twice daily after food",duration:"5 days"},{ name:"Tab Pantoprazole 40mg",freq:"Once daily morning",duration:"5 days"},{ name:"Cap Pregabalin 75mg",freq:"At bedtime",duration:"7 days"}] },
];

export const myPayments = [
  { id: "PAY-001", date: "05 Jun 2026", desc: "OPD Consultation – Dr. Sharma",  amount: 800,  method: "UPI",  status: "Paid",    invoice: "INV-2838" },
  { id: "PAY-002", date: "05 Jun 2026", desc: "Lab Tests – CBC + LFT",           amount: 2400, method: "UPI",  status: "Paid",    invoice: "INV-2839" },
  { id: "PAY-003", date: "01 Jun 2026", desc: "OPD Consultation – Dr. Sharma",  amount: 800,  method: "Card", status: "Paid",    invoice: "INV-2815" },
  { id: "PAY-004", date: "22 May 2026", desc: "OPD + X-Ray – Dr. Kumar",        amount: 2300, method: "Cash", status: "Paid",    invoice: "INV-2790" },
  { id: "PAY-005", date: "12 Jun 2026", desc: "Upcoming OPD – Dr. Sharma",      amount: 800,  method: "-",    status: "Pending", invoice: "-"        },
];
