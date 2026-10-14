import { STORAGE_KEYS } from '../constants/storageKeys';
import { AcademicBatch } from '../types';
import { logActivity } from './activityService';

export const getAcademicBatches = (): AcademicBatch[] => {
  const data = localStorage.getItem(STORAGE_KEYS.ACADEMIC_BATCHES);
  return data ? JSON.parse(data) : [];
};

export const getAcademicBatchById = (id: string): AcademicBatch | undefined => {
  const list = getAcademicBatches();
  return list.find((b) => b.id === id || b.batchCode === id);
};

export const getAcademicBatchesByCourse = (courseId: string): AcademicBatch[] => {
  return getAcademicBatches().filter((b) => b.courseId === courseId);
};

export const createAcademicBatch = (data: Omit<AcademicBatch, 'id' | 'currentStudentsCount'>): AcademicBatch => {
  const list = getAcademicBatches();
  const id = `batch-${Date.now()}`;
  const newBatch: AcademicBatch = {
    ...data,
    id,
    currentStudentsCount: 0,
  };

  list.unshift(newBatch);
  localStorage.setItem(STORAGE_KEYS.ACADEMIC_BATCHES, JSON.stringify(list));

  logActivity({
    action: 'Created Batch',
    user: 'Super Admin',
    details: `Created batch ${newBatch.name} (${newBatch.batchCode})`,
    timestamp: new Date().toISOString(),
    status: 'success'
  });

  return newBatch;
};

export const updateAcademicBatch = (id: string, updates: Partial<AcademicBatch>): AcademicBatch | null => {
  const list = getAcademicBatches();
  const idx = list.findIndex((b) => b.id === id);
  if (idx === -1) return null;

  list[idx] = { ...list[idx], ...updates };
  localStorage.setItem(STORAGE_KEYS.ACADEMIC_BATCHES, JSON.stringify(list));

  logActivity({
    action: 'Updated Batch',
    user: 'Super Admin',
    details: `Updated batch ${list[idx].name}`,
    timestamp: new Date().toISOString(),
    status: 'success'
  });

  return list[idx];
};

export const deleteAcademicBatch = (id: string): boolean => {
  let list = getAcademicBatches();
  const batch = list.find(b => b.id === id);
  if (!batch) return false;

  list = list.filter((b) => b.id !== id);
  localStorage.setItem(STORAGE_KEYS.ACADEMIC_BATCHES, JSON.stringify(list));

  logActivity({
    action: 'Deleted Batch',
    user: 'Super Admin',
    details: `Deleted batch: ${batch.name}`,
    timestamp: new Date().toISOString(),
    status: 'warning'
  });

  return true;
};

export const getBatches = getAcademicBatches;
export const getBatchById = getAcademicBatchById;
export const createBatch = createAcademicBatch;
export const updateBatch = updateAcademicBatch;
export const deleteBatch = deleteAcademicBatch;

export const academicBatchService = {
  getBatches: getAcademicBatches,
  getBatchById: getAcademicBatchById,
  createBatch: createAcademicBatch,
  updateBatch: updateAcademicBatch,
  deleteBatch: deleteAcademicBatch,
  getAcademicBatches,
  getAcademicBatchById,
  createAcademicBatch,
  updateAcademicBatch,
  deleteAcademicBatch,
};

