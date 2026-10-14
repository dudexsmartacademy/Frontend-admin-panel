import { STORAGE_KEYS } from '../constants/storageKeys';
import { getStorageData, setStorageData } from '../utils/storage';
import { StudentEnrollment } from '../types';
import { studentService } from './studentService';
import { activityService } from './activityService';

export const getEnrollments = (): StudentEnrollment[] => {
  return getStorageData<StudentEnrollment[]>(STORAGE_KEYS.ENROLLMENTS, []);
};

export const getEnrollmentById = (id: string): StudentEnrollment | undefined => {
  const list = getEnrollments();
  return list.find((e) => e.id === id);
};

export const getEnrollmentsByStudent = (studentId: string): StudentEnrollment[] => {
  const list = getEnrollments();
  return list.filter((e) => e.studentId === studentId);
};

export const getEnrollmentsByStudentId = getEnrollmentsByStudent;

export const createEnrollment = (data: Partial<StudentEnrollment> & {
  studentId: string;
  studentName: string;
  courseName: string;
  batchName: string;
}): StudentEnrollment => {
  const list = getEnrollments();
  const newEnrollment: StudentEnrollment = {
    id: `enr-${Date.now()}`,
    studentId: data.studentId,
    studentName: data.studentName,
    courseId: data.courseId,
    courseName: data.courseName,
    batchId: data.batchId,
    batchName: data.batchName,
    section: data.section || 'A',
    enrollmentDate: data.enrollmentDate || new Date().toISOString().split('T')[0],
    feePlan: data.feePlan || 'Semester Basis ($1,200/sem)',
    totalFee: data.totalFee || 4000,
    status: (data.status as any) || 'Active',
    ...data,
  };

  const updated = [newEnrollment, ...list];
  setStorageData(STORAGE_KEYS.ENROLLMENTS, updated);

  // Update student record
  const student = studentService.getStudentById(newEnrollment.studentId);
  if (student) {
    studentService.updateStudent(student.id, {
      course: newEnrollment.courseName,
      courseId: newEnrollment.courseId,
      courseName: newEnrollment.courseName,
      batch: newEnrollment.batchName,
      batchId: newEnrollment.batchId,
      batchName: newEnrollment.batchName,
    });
  }

  activityService.log(
    'Student Enrolled in Course',
    'enrollments',
    newEnrollment.studentName,
    `Enrolled ${newEnrollment.studentName} in ${newEnrollment.courseName} (${newEnrollment.batchName})`
  );

  return newEnrollment;
};

export const updateEnrollment = (id: string, updates: Partial<StudentEnrollment>): StudentEnrollment | null => {
  const list = getEnrollments();
  const index = list.findIndex((e) => e.id === id);
  if (index === -1) return null;

  list[index] = { ...list[index], ...updates };
  setStorageData(STORAGE_KEYS.ENROLLMENTS, list);
  return list[index];
};

export const updateEnrollmentStatus = (id: string, status: StudentEnrollment['status']): StudentEnrollment | null => {
  return updateEnrollment(id, { status });
};

export const deleteEnrollment = (id: string): boolean => {
  const list = getEnrollments();
  const filtered = list.filter((e) => e.id !== id);
  setStorageData(STORAGE_KEYS.ENROLLMENTS, filtered);
  return true;
};

export const enrollmentService = {
  getEnrollments,
  getEnrollmentById,
  getEnrollmentsByStudent,
  getEnrollmentsByStudentId: getEnrollmentsByStudent,
  createEnrollment,
  updateEnrollment,
  updateEnrollmentStatus,
  deleteEnrollment,
};
