import { STORAGE_KEYS } from '../constants/storageKeys';
import { AcademicClass } from '../types';
import { logActivity } from './activityService';

export const getAcademicClasses = (): AcademicClass[] => {
  const data = localStorage.getItem(STORAGE_KEYS.ACADEMIC_CLASSES);
  return data ? JSON.parse(data) : [];
};

export const getAcademicClassById = (id: string): AcademicClass | undefined => {
  const list = getAcademicClasses();
  return list.find((c) => c.id === id);
};

export const getAcademicClassesByBatch = (batchId: string): AcademicClass[] => {
  return getAcademicClasses().filter((c) => c.batchId === batchId);
};

export const getAcademicClassesByTeacher = (teacherId: string): AcademicClass[] => {
  return getAcademicClasses().filter((c) => c.teacherId === teacherId);
};

export const createAcademicClass = (data: Omit<AcademicClass, 'id'>): AcademicClass => {
  const list = getAcademicClasses();
  const id = `cls-${Date.now()}`;
  const newClass: AcademicClass = {
    ...data,
    id,
  };

  list.unshift(newClass);
  localStorage.setItem(STORAGE_KEYS.ACADEMIC_CLASSES, JSON.stringify(list));

  logActivity({
    action: 'Scheduled Academic Class',
    user: 'Super Admin',
    details: `Scheduled ${newClass.title} for ${newClass.courseName} (${newClass.batchName})`,
    timestamp: new Date().toISOString(),
    status: 'success'
  });

  return newClass;
};

export const updateAcademicClass = (id: string, updates: Partial<AcademicClass>): AcademicClass | null => {
  const list = getAcademicClasses();
  const idx = list.findIndex((c) => c.id === id);
  if (idx === -1) return null;

  list[idx] = { ...list[idx], ...updates };
  localStorage.setItem(STORAGE_KEYS.ACADEMIC_CLASSES, JSON.stringify(list));

  logActivity({
    action: 'Updated Academic Class',
    user: 'Super Admin',
    details: `Updated class: ${list[idx].title}`,
    timestamp: new Date().toISOString(),
    status: 'success'
  });

  return list[idx];
};

export const deleteAcademicClass = (id: string): boolean => {
  let list = getAcademicClasses();
  const cls = list.find(c => c.id === id);
  if (!cls) return false;

  list = list.filter((c) => c.id !== id);
  localStorage.setItem(STORAGE_KEYS.ACADEMIC_CLASSES, JSON.stringify(list));

  logActivity({
    action: 'Deleted Academic Class',
    user: 'Super Admin',
    details: `Deleted class: ${cls.title}`,
    timestamp: new Date().toISOString(),
    status: 'warning'
  });

  return true;
};

export const getClasses = getAcademicClasses;
export const getClassById = getAcademicClassById;
export const createClass = createAcademicClass;
export const updateClass = updateAcademicClass;
export const deleteClass = deleteAcademicClass;

export const academicClassService = {
  getClasses: getAcademicClasses,
  getClassById: getAcademicClassById,
  createClass: createAcademicClass,
  updateClass: updateAcademicClass,
  deleteClass: deleteAcademicClass,
  getAcademicClasses,
  getAcademicClassById,
  getAcademicClassesByBatch,
  getAcademicClassesByTeacher,
  createAcademicClass,
  updateAcademicClass,
  deleteAcademicClass,
};

