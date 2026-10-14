import { STORAGE_KEYS } from '../constants/storageKeys';
import { AcademicSubject } from '../types';
import { logActivity } from './activityService';

export const getAcademicSubjects = (): AcademicSubject[] => {
  const data = localStorage.getItem(STORAGE_KEYS.ACADEMIC_SUBJECTS);
  return data ? JSON.parse(data) : [];
};

export const getAcademicSubjectById = (id: string): AcademicSubject | undefined => {
  const list = getAcademicSubjects();
  return list.find((s) => s.id === id || s.subjectCode === id);
};

export const getAcademicSubjectsByCourse = (courseId: string): AcademicSubject[] => {
  return getAcademicSubjects().filter((s) => s.courseId === courseId);
};

export const createAcademicSubject = (data: Omit<AcademicSubject, 'id'>): AcademicSubject => {
  const list = getAcademicSubjects();
  const id = `subj-${Date.now()}`;
  const newSubj: AcademicSubject = {
    ...data,
    id,
  };

  list.unshift(newSubj);
  localStorage.setItem(STORAGE_KEYS.ACADEMIC_SUBJECTS, JSON.stringify(list));

  logActivity({
    action: 'Created Subject',
    user: 'Super Admin',
    details: `Added new subject: ${newSubj.name} (${newSubj.subjectCode})`,
    timestamp: new Date().toISOString(),
    status: 'success'
  });

  return newSubj;
};

export const updateAcademicSubject = (id: string, updates: Partial<AcademicSubject>): AcademicSubject | null => {
  const list = getAcademicSubjects();
  const idx = list.findIndex((s) => s.id === id);
  if (idx === -1) return null;

  list[idx] = { ...list[idx], ...updates };
  localStorage.setItem(STORAGE_KEYS.ACADEMIC_SUBJECTS, JSON.stringify(list));

  logActivity({
    action: 'Updated Subject',
    user: 'Super Admin',
    details: `Updated subject: ${list[idx].name}`,
    timestamp: new Date().toISOString(),
    status: 'success'
  });

  return list[idx];
};

export const deleteAcademicSubject = (id: string): boolean => {
  let list = getAcademicSubjects();
  const subj = list.find(s => s.id === id);
  if (!subj) return false;

  list = list.filter((s) => s.id !== id);
  localStorage.setItem(STORAGE_KEYS.ACADEMIC_SUBJECTS, JSON.stringify(list));

  logActivity({
    action: 'Deleted Subject',
    user: 'Super Admin',
    details: `Deleted subject: ${subj.name}`,
    timestamp: new Date().toISOString(),
    status: 'warning'
  });

  return true;
};

export const getSubjects = getAcademicSubjects;
export const getSubjectById = getAcademicSubjectById;
export const createSubject = createAcademicSubject;
export const updateSubject = updateAcademicSubject;
export const deleteSubject = deleteAcademicSubject;

export const academicSubjectService = {
  getSubjects: getAcademicSubjects,
  getSubjectById: getAcademicSubjectById,
  createSubject: createAcademicSubject,
  updateSubject: updateAcademicSubject,
  deleteSubject: deleteAcademicSubject,
  getAcademicSubjects,
  getAcademicSubjectById,
  getAcademicSubjectsByCourse,
  createAcademicSubject,
  updateAcademicSubject,
  deleteAcademicSubject,
};

