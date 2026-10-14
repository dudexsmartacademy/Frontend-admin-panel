import { STORAGE_KEYS } from '../constants/storageKeys';
import { AcademicCourse } from '../types';
import { logActivity } from './activityService';

export const getAcademicCourses = (): AcademicCourse[] => {
  const data = localStorage.getItem(STORAGE_KEYS.ACADEMIC_COURSES);
  return data ? JSON.parse(data) : [];
};

export const getAcademicCourseById = (id: string): AcademicCourse | undefined => {
  const list = getAcademicCourses();
  return list.find((c) => c.id === id || c.courseCode === id);
};

export const createAcademicCourse = (courseData: Omit<AcademicCourse, 'id' | 'createdAt' | 'enrolledStudentsCount'>): AcademicCourse => {
  const list = getAcademicCourses();
  const id = `crs-${Date.now()}`;
  const newCourse: AcademicCourse = {
    ...courseData,
    id,
    enrolledStudentsCount: 0,
    createdAt: new Date().toISOString().split('T')[0],
  };

  list.unshift(newCourse);
  localStorage.setItem(STORAGE_KEYS.ACADEMIC_COURSES, JSON.stringify(list));

  logActivity({
    action: 'Created Course',
    user: 'Super Admin',
    details: `Created new course: ${newCourse.name} (${newCourse.courseCode})`,
    timestamp: new Date().toISOString(),
    status: 'success'
  });

  return newCourse;
};

export const updateAcademicCourse = (id: string, updates: Partial<AcademicCourse>): AcademicCourse | null => {
  const list = getAcademicCourses();
  const idx = list.findIndex((c) => c.id === id);
  if (idx === -1) return null;

  list[idx] = { ...list[idx], ...updates };
  localStorage.setItem(STORAGE_KEYS.ACADEMIC_COURSES, JSON.stringify(list));

  logActivity({
    action: 'Updated Course',
    user: 'Super Admin',
    details: `Updated course: ${list[idx].name}`,
    timestamp: new Date().toISOString(),
    status: 'success'
  });

  return list[idx];
};

export const deleteAcademicCourse = (id: string): boolean => {
  let list = getAcademicCourses();
  const course = list.find(c => c.id === id);
  if (!course) return false;

  list = list.filter((c) => c.id !== id);
  localStorage.setItem(STORAGE_KEYS.ACADEMIC_COURSES, JSON.stringify(list));

  logActivity({
    action: 'Deleted Course',
    user: 'Super Admin',
    details: `Deleted course: ${course.name}`,
    timestamp: new Date().toISOString(),
    status: 'warning'
  });

  return true;
};

export const getCourses = getAcademicCourses;
export const getCourseById = getAcademicCourseById;
export const createCourse = createAcademicCourse;
export const updateCourse = updateAcademicCourse;
export const deleteCourse = deleteAcademicCourse;

export const academicCourseService = {
  getCourses: getAcademicCourses,
  getCourseById: getAcademicCourseById,
  createCourse: createAcademicCourse,
  updateCourse: updateAcademicCourse,
  deleteCourse: deleteAcademicCourse,
  getAcademicCourses,
  getAcademicCourseById,
  createAcademicCourse,
  updateAcademicCourse,
  deleteAcademicCourse,
};

