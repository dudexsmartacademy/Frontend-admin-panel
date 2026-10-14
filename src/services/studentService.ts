import { STORAGE_KEYS } from '../constants/storageKeys';
import { getStorageData, setStorageData } from '../utils/storage';
import { Student, StudentStatus } from '../types';
import { activityService } from './activityService';

export const getStudents = (): Student[] => {
  return getStorageData<Student[]>(STORAGE_KEYS.STUDENTS, []);
};

export const getStudentById = (id: string): Student | undefined => {
  const list = getStudents();
  return list.find((s) => s.id === id || s.studentId === id);
};

export const createStudent = (data: Partial<Student>): Student => {
  const list = getStudents();
  const count = list.length + 1;
  const year = new Date().getFullYear();
  const studentId = data.studentId || `STU-${year}-${String(count).padStart(3, '0')}`;

  const newStudent: Student = {
    id: `stu-${Date.now()}`,
    studentId,
    fullName: data.fullName || 'New Student',
    avatar: data.avatar || data.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    profileImage: data.profileImage || data.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    email: data.email || 'student@dudex.academy',
    phone: data.phone || '+1 (555) 000-0000',
    dob: data.dob || '2005-01-01',
    gender: data.gender || 'Male',
    address: data.address || 'Academy Hostel Block A',
    department: data.department || 'Software Engineering',
    course: data.course || data.courseName || 'Full-Stack Web Development',
    courseId: data.courseId,
    courseName: data.courseName || data.course || 'Full-Stack Web Development',
    batch: data.batch || data.batchName || 'Batch 2026-Alpha',
    batchId: data.batchId,
    batchName: data.batchName || data.batch || 'Batch 2026-Alpha',
    section: data.section || 'A',
    academicYear: data.academicYear || '2026-2027',
    admissionDate: data.admissionDate || new Date().toISOString().split('T')[0],
    admissionId: data.admissionId || `ADM-${year}-001`,
    guardianName: data.guardianName || 'Guardian Name',
    guardianPhone: data.guardianPhone || data.phone || '',
    guardianEmail: data.guardianEmail || '',
    guardianRelation: data.guardianRelation || 'Parent / Guardian',
    emergencyContact: data.emergencyContact || data.phone || '',
    loginEmail: data.loginEmail || data.accountEmail || data.email || '',
    accountEmail: data.accountEmail || data.loginEmail || data.email || '',
    status: data.status || 'Active',
    feeStatus: data.feeStatus || 'Pending',
    attendancePercentage: data.attendancePercentage !== undefined ? data.attendancePercentage : 88,
    averageScore: data.averageScore !== undefined ? data.averageScore : (data.averageMarks || 82),
    averageMarks: data.averageMarks !== undefined ? data.averageMarks : (data.averageScore || 82),
    assignmentsCompleted: data.assignmentsCompleted || 10,
    totalAssignments: data.totalAssignments || 12,
    examsAttempted: data.examsAttempted || 3,
    totalExams: data.totalExams || 4,
    totalFee: data.totalFee || 4000,
    paidFee: data.paidFee || 0,
    skills: data.skills || ['JavaScript', 'React'],
    careerInterests: data.careerInterests || 'Software Engineer',
    notes: data.notes || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...data,
  };

  const updated = [newStudent, ...list];
  setStorageData(STORAGE_KEYS.STUDENTS, updated);

  activityService.log(
    'Student Enrolled',
    'students',
    newStudent.fullName,
    `Registered new student ${newStudent.fullName} (${newStudent.studentId}) in ${newStudent.course}`
  );

  return newStudent;
};

export const updateStudent = (id: string, updates: Partial<Student>): Student | null => {
  const list = getStudents();
  const index = list.findIndex((s) => s.id === id || s.studentId === id);
  if (index === -1) return null;

  const updatedStudent: Student = {
    ...list[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  list[index] = updatedStudent;
  setStorageData(STORAGE_KEYS.STUDENTS, list);

  activityService.log(
    'Student Record Updated',
    'students',
    updatedStudent.fullName,
    `Updated academic and contact details for ${updatedStudent.fullName} (${updatedStudent.studentId})`
  );

  return updatedStudent;
};

export const updateStudentStatus = (id: string, status: any): Student | null => {
  return updateStudent(id, { status });
};

export const toggleStudentStatus = (id: string, status: StudentStatus): Student | null => {
  return updateStudent(id, { status });
};

export const deleteStudent = (id: string): boolean => {
  const list = getStudents();
  const target = list.find((s) => s.id === id || s.studentId === id);
  if (!target) return false;

  const filtered = list.filter((s) => s.id !== id && s.studentId !== id);
  setStorageData(STORAGE_KEYS.STUDENTS, filtered);

  activityService.log(
    'Student Record Deleted',
    'students',
    target.fullName,
    `Removed student ${target.fullName} (${target.studentId}) from academy register`
  );

  return true;
};

export const generateNextStudentId = (): string => {
  const list = getStudents();
  const count = list.length + 1;
  const year = new Date().getFullYear();
  const padded = String(count).padStart(3, '0');
  return `STU-${year}-${padded}`;
};

export const getAtRiskStudents = (): Student[] => {
  const list = getStudents();
  return list.filter((s) => {
    const isInactive = s.status === 'Suspended' || s.status === 'suspended';
    const lowAtt = (s.attendancePercentage || 0) < 75;
    const lowMarks = (s.averageScore !== undefined ? s.averageScore : (s.averageMarks || 80)) < 50;
    return isInactive || lowAtt || lowMarks;
  });
};

export const studentService = {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  updateStudentStatus,
  toggleStudentStatus,
  deleteStudent,
  generateNextStudentId,
  getAtRiskStudents,
};
