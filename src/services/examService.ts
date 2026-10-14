import { STORAGE_KEYS } from '../constants/storageKeys';
import { getStorageData, setStorageData } from '../utils/storage';
import { StudentExam, ExamStatus } from '../types';
import { activityService } from './activityService';

export const getExams = (): StudentExam[] => {
  return getStorageData<StudentExam[]>(STORAGE_KEYS.EXAMS, []);
};

export const getExamById = (id: string): StudentExam | undefined => {
  const list = getExams();
  return list.find((e) => e.id === id || e.examCode === id);
};

export const createExam = (data: Partial<StudentExam>): StudentExam => {
  const list = getExams();
  const count = list.length + 1;
  const year = new Date().getFullYear();
  const newExam: StudentExam = {
    id: `exm-${Date.now()}`,
    examCode: data.examCode || `EXM-${year}-E${count}`,
    title: data.title || 'Examination',
    courseId: data.courseId,
    courseName: data.courseName || 'Full-Stack Web Development',
    subject: data.subject,
    subjectName: data.subjectName || 'Core Curriculum',
    teacherId: data.teacherId,
    teacherName: data.teacherName || 'Dr. Sarah Jenkins',
    batchId: data.batchId,
    batchName: data.batchName || 'Batch 2026-Alpha',
    startDate: data.startDate || new Date().toISOString().split('T')[0],
    startTime: data.startTime || '10:00 AM',
    endDate: data.endDate || data.startDate || new Date().toISOString().split('T')[0],
    endTime: data.endTime || '01:00 PM',
    durationMinutes: data.durationMinutes || 180,
    totalMarks: data.totalMarks || 100,
    passingMarks: data.passingMarks || 50,
    status: data.status || 'Scheduled',
    enrolledStudentsCount: data.enrolledStudentsCount || 18,
    attemptsCount: 0,
    resultsPublished: false,
    ...data,
  };

  const updated = [newExam, ...list];
  setStorageData(STORAGE_KEYS.EXAMS, updated);

  activityService.log(
    'Exam Scheduled',
    'exams',
    newExam.title,
    `Scheduled examination ${newExam.title} (${newExam.examCode}) for ${newExam.courseName}`
  );

  return newExam;
};

export const updateExam = (id: string, updates: Partial<StudentExam>): StudentExam | null => {
  const list = getExams();
  const index = list.findIndex((e) => e.id === id);
  if (index === -1) return null;

  list[index] = { ...list[index], ...updates };
  setStorageData(STORAGE_KEYS.EXAMS, list);

  activityService.log(
    'Exam Details Updated',
    'exams',
    list[index].title,
    `Updated parameters for exam ${list[index].title}`
  );

  return list[index];
};

export const updateExamStatus = (id: string, status: StudentExam['status']): StudentExam | null => {
  return updateExam(id, { status });
};

export const deleteExam = (id: string): boolean => {
  const list = getExams();
  const target = list.find((e) => e.id === id);
  if (!target) return false;

  const filtered = list.filter((e) => e.id !== id);
  setStorageData(STORAGE_KEYS.EXAMS, filtered);

  activityService.log(
    'Exam Removed',
    'exams',
    target.title,
    `Cancelled/Removed exam ${target.title}`
  );

  return true;
};

export const examService = {
  getExams,
  getExamById,
  createExam,
  updateExam,
  updateExamStatus,
  deleteExam,
};
