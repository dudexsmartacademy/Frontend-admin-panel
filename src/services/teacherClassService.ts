import { STORAGE_KEYS } from '../constants/storageKeys';
import { getStorageData, setStorageData } from '../utils/storage';
import { TeacherClass } from '../types';
import { activityService } from './activityService';
import { teacherService } from './teacherService';

export const teacherClassService = {
  getClasses(): TeacherClass[] {
    return getStorageData<TeacherClass[]>(STORAGE_KEYS.TEACHER_CLASSES, []);
  },

  getClassesByTeacherId(teacherId: string): TeacherClass[] {
    const list = this.getClasses();
    return list.filter((c) => c.teacherId === teacherId);
  },

  getClassById(id: string): TeacherClass | undefined {
    const list = this.getClasses();
    return list.find((c) => c.id === id);
  },

  createClass(data: Omit<TeacherClass, 'id'>): TeacherClass {
    const list = this.getClasses();
    const newClass: TeacherClass = {
      ...data,
      id: `cls-${Date.now()}`,
    };

    const updated = [newClass, ...list];
    setStorageData(STORAGE_KEYS.TEACHER_CLASSES, updated);

    // Update teacher assignedClassIds
    const teacher = teacherService.getTeacherById(newClass.teacherId);
    if (teacher) {
      const classIds = Array.from(new Set([...(teacher.assignedClassIds || []), newClass.id]));
      teacherService.updateTeacher(teacher.id, { assignedClassIds: classIds });
    }

    activityService.log(
      'Class Scheduled',
      'classes',
      newClass.title,
      `Scheduled class "${newClass.title}" for ${newClass.teacherName} on ${newClass.date}`
    );

    return newClass;
  },

  updateClass(id: string, updates: Partial<TeacherClass>): TeacherClass | null {
    const list = this.getClasses();
    const index = list.findIndex((c) => c.id === id);
    if (index === -1) return null;

    list[index] = { ...list[index], ...updates };
    setStorageData(STORAGE_KEYS.TEACHER_CLASSES, list);

    activityService.log(
      'Class Updated',
      'classes',
      list[index].title,
      `Updated schedule/room for class "${list[index].title}"`
    );

    return list[index];
  },

  deleteClass(id: string): boolean {
    const list = this.getClasses();
    const target = list.find((c) => c.id === id);
    if (!target) return false;

    const filtered = list.filter((c) => c.id !== id);
    setStorageData(STORAGE_KEYS.TEACHER_CLASSES, filtered);

    // Remove from teacher
    const teacher = teacherService.getTeacherById(target.teacherId);
    if (teacher) {
      const classIds = (teacher.assignedClassIds || []).filter((cid) => cid !== id);
      teacherService.updateTeacher(teacher.id, { assignedClassIds: classIds });
    }

    activityService.log(
      'Class Removed',
      'classes',
      target.title,
      `Removed class "${target.title}" from schedule`
    );

    return true;
  },
};
