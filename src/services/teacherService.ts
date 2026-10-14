import { STORAGE_KEYS } from '../constants/storageKeys';
import { getStorageData, setStorageData } from '../utils/storage';
import { Teacher, TeacherStatus } from '../types';
import { activityService } from './activityService';

export const teacherService = {
  getTeachers(): Teacher[] {
    return getStorageData<Teacher[]>(STORAGE_KEYS.TEACHERS, []);
  },

  getTeacherById(id: string): Teacher | undefined {
    const list = this.getTeachers();
    return list.find((t) => t.id === id || t.teacherId === id);
  },

  createTeacher(data: Omit<Teacher, 'id' | 'createdAt' | 'updatedAt' | 'assignedCourseIds' | 'assignedClassIds'>): Teacher {
    const list = this.getTeachers();
    const newTeacher: Teacher = {
      ...data,
      id: `tch-${Date.now()}`,
      assignedCourseIds: [],
      assignedClassIds: [],
      totalStudentsHandled: 0,
      attendanceRate: 100,
      rating: 5.0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updated = [newTeacher, ...list];
    setStorageData(STORAGE_KEYS.TEACHERS, updated);

    activityService.log(
      'Teacher Created',
      'teachers',
      newTeacher.fullName,
      `Added new faculty member ${newTeacher.fullName} (${newTeacher.teacherId}) to ${newTeacher.department}`
    );

    return newTeacher;
  },

  updateTeacher(id: string, updates: Partial<Teacher>): Teacher | null {
    const list = this.getTeachers();
    const index = list.findIndex((t) => t.id === id || t.teacherId === id);
    if (index === -1) return null;

    const updatedTeacher: Teacher = {
      ...list[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    list[index] = updatedTeacher;
    setStorageData(STORAGE_KEYS.TEACHERS, list);

    activityService.log(
      'Teacher Updated',
      'teachers',
      updatedTeacher.fullName,
      `Updated faculty profile details for ${updatedTeacher.fullName} (${updatedTeacher.teacherId})`
    );

    return updatedTeacher;
  },

  toggleTeacherStatus(id: string, status: TeacherStatus): Teacher | null {
    return this.updateTeacher(id, { status });
  },

  deleteTeacher(id: string): boolean {
    const list = this.getTeachers();
    const target = list.find((t) => t.id === id || t.teacherId === id);
    if (!target) return false;

    const filtered = list.filter((t) => t.id !== id && t.teacherId !== id);
    setStorageData(STORAGE_KEYS.TEACHERS, filtered);

    activityService.log(
      'Teacher Deleted',
      'teachers',
      target.fullName,
      `Removed faculty profile for ${target.fullName} (${target.teacherId})`
    );

    return true;
  },

  generateNextTeacherId(): string {
    const list = this.getTeachers();

    // Look for FAC prefix first (e.g. FAC099 -> FAC100)
    const facNumbers = list
      .map((t) => {
        const match = t.teacherId?.match(/FAC[-_]?(\d+)/i);
        return match ? parseInt(match[1], 10) : null;
      })
      .filter((n): n is number => n !== null);

    if (facNumbers.length > 0) {
      const nextNum = Math.max(...facNumbers) + 1;
      return `FAC${String(nextNum).padStart(3, '0')}`;
    }

    // Look for numeric suffix in any existing IDs or use list count
    const suffixNumbers = list
      .map((t) => {
        const match = t.teacherId?.match(/(\d{3})$/);
        return match ? parseInt(match[1], 10) : null;
      })
      .filter((n): n is number => n !== null);

    const nextNum = suffixNumbers.length > 0 ? Math.max(...suffixNumbers) + 1 : list.length + 1;
    return `FAC${String(nextNum).padStart(3, '0')}`;
  },
};
