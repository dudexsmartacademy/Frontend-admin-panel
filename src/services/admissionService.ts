import { STORAGE_KEYS } from '../constants/storageKeys';
import { getStorageData, setStorageData } from '../utils/storage';
import { StudentAdmission, AdmissionStatus, Student } from '../types';
import { studentService } from './studentService';
import { activityService } from './activityService';

export const getAdmissions = (): StudentAdmission[] => {
  return getStorageData<StudentAdmission[]>(STORAGE_KEYS.ADMISSIONS, []);
};

export const getAdmissionById = (id: string): StudentAdmission | undefined => {
  const list = getAdmissions();
  return list.find((a) => a.id === id || a.applicationId === id);
};

export const createAdmission = (data: Partial<StudentAdmission>): StudentAdmission => {
  const list = getAdmissions();
  const count = list.length + 1;
  const year = new Date().getFullYear();
  const newAdmission: StudentAdmission = {
    id: `adm-${Date.now()}`,
    applicationId: `ADM-${year}-${String(count).padStart(3, '0')}`,
    applicantName: data.applicantName || (data as any).fullName || 'New Applicant',
    fullName: data.fullName || data.applicantName || 'New Applicant',
    email: data.email || 'applicant@dudex.academy',
    phone: data.phone || '+1 (555) 000-0000',
    gender: data.gender || 'Male',
    courseName: data.courseName || 'Full-Stack Web Development',
    qualification: data.qualification || "Bachelor's Degree",
    applicationDate: new Date().toISOString().split('T')[0],
    status: (data.status as any) || 'Pending',
    notes: data.notes || '',
    ...data,
  };

  const updated = [newAdmission, ...list];
  setStorageData(STORAGE_KEYS.ADMISSIONS, updated);

  activityService.log(
    'Admission Application Submitted',
    'admissions',
    newAdmission.applicantName,
    `Submitted application ${newAdmission.applicationId} for ${newAdmission.courseName}`
  );

  return newAdmission;
};

export const updateAdmissionStatus = (
  id: string,
  status: any,
  reviewerNotes?: string,
  adminName = 'Dr. Alexander Vance'
): StudentAdmission | null => {
  const list = getAdmissions();
  const index = list.findIndex((a) => a.id === id || a.applicationId === id);
  if (index === -1) return null;

  const current = list[index];
  const updated: StudentAdmission = {
    ...current,
    status,
    reviewedBy: adminName,
    reviewedDate: new Date().toISOString(),
    reviewerNotes: reviewerNotes || current.reviewerNotes,
  };

  list[index] = updated;
  setStorageData(STORAGE_KEYS.ADMISSIONS, list);

  activityService.log(
    `Admission Application ${String(status).toUpperCase()}`,
    'admissions',
    updated.applicantName || updated.fullName,
    `Application ${updated.applicationId} status marked as ${status}`
  );

  return updated;
};

export const convertAdmissionToStudent = (admissionId: string): Student | null => {
  const adm = getAdmissionById(admissionId);
  if (!adm) return null;

  const studentId = studentService.generateNextStudentId();
  const name = adm.applicantName || adm.fullName || 'Converted Student';

  const createdStudent = studentService.createStudent({
    studentId,
    fullName: name,
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250',
    email: adm.email,
    phone: adm.phone,
    dob: adm.dob || '2005-01-01',
    gender: adm.gender || 'Male',
    address: adm.address || 'Academy Hostel Block A',
    department: adm.department || 'Software Engineering',
    course: adm.courseName || 'Full-Stack Web Development',
    courseId: adm.courseId,
    courseName: adm.courseName || 'Full-Stack Web Development',
    batch: adm.batchName || 'Batch 2026-Alpha',
    batchId: adm.batchId,
    batchName: adm.batchName || 'Batch 2026-Alpha',
    section: 'A',
    academicYear: '2026-2027',
    admissionDate: new Date().toISOString().split('T')[0],
    admissionId: adm.applicationId,
    guardianName: adm.guardianName || 'Robert Vance',
    guardianPhone: adm.guardianPhone || adm.phone,
    guardianEmail: adm.guardianEmail || adm.email,
    guardianRelation: 'Parent / Guardian',
    emergencyContact: adm.guardianPhone || adm.phone,
    loginEmail: adm.email,
    status: 'Active',
    feeStatus: 'Pending',
    attendancePercentage: 100,
    averageScore: 0,
    assignmentsCompleted: 0,
    totalAssignments: 0,
    examsAttempted: 0,
    totalExams: 0,
    totalFee: 4000,
    paidFee: 0,
    skills: ['Academic Candidate'],
    careerInterests: ['Full-Stack Engineer'],
    notes: `Admitted via Application ${adm.applicationId}`,
  });

  updateAdmissionStatus(
    adm.id,
    'Converted',
    `Converted to student account (${studentId})`
  );

  activityService.log(
    'Applicant Converted to Enrolled Student',
    'admissions',
    name,
    `Converted admission application ${adm.applicationId} into student ${name} (${studentId})`
  );

  return createdStudent;
};

export const admissionService = {
  getAdmissions,
  getAdmissionById,
  createAdmission,
  updateAdmissionStatus,
  convertToStudent: (admissionId: string) => {
    const student = convertAdmissionToStudent(admissionId);
    const admission = getAdmissionById(admissionId);
    return student && admission ? { student, admission } : null;
  },
  deleteAdmission: (id: string) => {
    const list = getAdmissions();
    const filtered = list.filter((a) => a.id !== id);
    setStorageData(STORAGE_KEYS.ADMISSIONS, filtered);
    return true;
  },
};
