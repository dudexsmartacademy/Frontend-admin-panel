import { STORAGE_KEYS } from '../constants/storageKeys';
import { getStorageData, setStorageData } from '../utils/storage';
import { StudentResult } from '../types';
import { calculateGrade } from '../utils/gradeCalculator';
import { studentService } from './studentService';
import { examService } from './examService';
import { activityService } from './activityService';

export const getResults = (): StudentResult[] => {
  return getStorageData<StudentResult[]>(STORAGE_KEYS.RESULTS, []);
};

export const getResultById = (id: string): StudentResult | undefined => {
  const list = getResults();
  return list.find((r) => r.id === id || r.resultCode === id);
};

export const getResultsByStudent = (studentId: string): StudentResult[] => {
  return getResults().filter((r) => r.studentId === studentId);
};

export const getResultsByStudentId = getResultsByStudent;

export const getResultsByExamId = (examId: string): StudentResult[] => {
  return getResults().filter((r) => r.examId === examId);
};

export const recordStudentResult = (data: Partial<StudentResult> & {
  studentId: string;
  studentName: string;
  examId: string;
  examTitle: string;
  marksObtained: number;
  maxMarks: number;
}): StudentResult => {
  const list = getResults();
  const count = list.length + 1;
  const year = new Date().getFullYear();

  const gradeCalc = calculateGrade(data.marksObtained, data.maxMarks);

  const newResult: StudentResult = {
    id: `res-${Date.now()}`,
    resultCode: data.resultCode || `RES-${year}-${String(count).padStart(3, '0')}`,
    studentId: data.studentId,
    studentName: data.studentName,
    examId: data.examId,
    examTitle: data.examTitle,
    courseName: data.courseName || 'Full-Stack Web Development',
    subjectName: data.subjectName || 'Core Subject',
    marksObtained: data.marksObtained,
    maxMarks: data.maxMarks,
    percentage: gradeCalc.percentage,
    grade: gradeCalc.grade,
    resultStatus: (gradeCalc.resultStatus as any) || (gradeCalc.isPass ? 'Passed' : 'Failed'),
    publishedDate: new Date().toISOString().split('T')[0],
    feedback: data.feedback || 'Evaluated and verified by faculty.',
    ...data,
  };

  const updated = [newResult, ...list];
  setStorageData(STORAGE_KEYS.RESULTS, updated);

  // Recalculate average
  recalculateStudentAverageScore(data.studentId);

  // Increment exam attempts
  const exam = examService.getExamById(data.examId);
  if (exam) {
    examService.updateExam(exam.id, {
      attemptsCount: (exam.attemptsCount || 0) + 1,
      resultsPublished: true,
    });
  }

  activityService.log(
    'Exam Result Published',
    'results',
    newResult.studentName,
    `Published result (${gradeCalc.grade}, ${data.marksObtained}/${data.maxMarks}) for ${newResult.studentName} in ${newResult.examTitle}`
  );

  return newResult;
};

export const createResult = recordStudentResult;

export const updateResult = (id: string, updates: Partial<StudentResult>): StudentResult | null => {
  const list = getResults();
  const index = list.findIndex((r) => r.id === id);
  if (index === -1) return null;

  let updated = { ...list[index], ...updates };

  if (updates.marksObtained !== undefined || updates.maxMarks !== undefined) {
    const calc = calculateGrade(updated.marksObtained, updated.maxMarks);
    updated.percentage = calc.percentage;
    updated.grade = calc.grade;
    updated.resultStatus = (calc.resultStatus as any) || (calc.isPass ? 'Passed' : 'Failed');
  }

  list[index] = updated;
  setStorageData(STORAGE_KEYS.RESULTS, list);
  recalculateStudentAverageScore(updated.studentId);

  activityService.log(
    'Exam Result Updated',
    'results',
    updated.studentName,
    `Updated marks to ${updated.marksObtained}/${updated.maxMarks} (${updated.grade}) for ${updated.studentName}`
  );

  return updated;
};

export const deleteResult = (id: string): boolean => {
  const list = getResults();
  const target = list.find((r) => r.id === id);
  if (!target) return false;

  const filtered = list.filter((r) => r.id !== id);
  setStorageData(STORAGE_KEYS.RESULTS, filtered);
  recalculateStudentAverageScore(target.studentId);

  activityService.log(
    'Exam Result Removed',
    'results',
    target.studentName,
    `Removed result record for ${target.studentName}`
  );

  return true;
};

export const recalculateStudentAverageScore = (studentId: string): void => {
  const studentResults = getResultsByStudent(studentId);
  if (studentResults.length === 0) return;

  const totalPct = studentResults.reduce((acc, r) => acc + (r.percentage || 0), 0);
  const avgScore = Math.round((totalPct / studentResults.length) * 10) / 10;

  studentService.updateStudent(studentId, {
    averageScore: avgScore,
    averageMarks: avgScore,
    examsAttempted: studentResults.length,
  });
};

export const resultService = {
  getResults,
  getResultById,
  getResultsByStudent,
  getResultsByStudentId: getResultsByStudent,
  getResultsByExamId,
  createResult,
  recordStudentResult,
  updateResult,
  deleteResult,
  recalculateStudentAverageScore,
};
