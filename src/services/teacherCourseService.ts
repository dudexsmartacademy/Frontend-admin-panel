import { STORAGE_KEYS } from '../constants/storageKeys';
import { getStorageData, setStorageData } from '../utils/storage';
import { TeacherCourse } from '../types';
import { activityService } from './activityService';
import { teacherService } from './teacherService';

export const teacherCourseService = {
  getCourses(): TeacherCourse[] {
    return getStorageData<TeacherCourse[]>(STORAGE_KEYS.TEACHER_COURSES, []);
  },

  getCoursesByTeacherId(teacherId: string): TeacherCourse[] {
    const list = this.getCourses();
    return list.filter((c) => c.teacherId === teacherId);
  },

  getCourseById(id: string): TeacherCourse | undefined {
    const list = this.getCourses();
    return list.find((c) => c.id === id || c.code === id);
  },

  assignCourse(courseData: Omit<TeacherCourse, 'id'>): TeacherCourse {
    const list = this.getCourses();
    const newCourse: TeacherCourse = {
      ...courseData,
      id: `crs-${Date.now()}`,
    };

    const updated = [newCourse, ...list];
    setStorageData(STORAGE_KEYS.TEACHER_COURSES, updated);

    // Update teacher's assignedCourseIds
    const teacher = teacherService.getTeacherById(newCourse.teacherId);
    if (teacher) {
      const courseIds = Array.from(new Set([...(teacher.assignedCourseIds || []), newCourse.id]));
      teacherService.updateTeacher(teacher.id, { assignedCourseIds: courseIds });
    }

    activityService.log(
      'Course Assigned',
      'courses',
      newCourse.name,
      `Assigned course "${newCourse.name}" (${newCourse.code}) to ${newCourse.teacherName || 'Faculty'}`
    );

    return newCourse;
  },

  updateCourse(id: string, updates: Partial<TeacherCourse>): TeacherCourse | null {
    const list = this.getCourses();
    const index = list.findIndex((c) => c.id === id);
    if (index === -1) return null;

    list[index] = { ...list[index], ...updates };
    setStorageData(STORAGE_KEYS.TEACHER_COURSES, list);
    return list[index];
  },

  removeCourseAssignment(courseId: string): boolean {
    const list = this.getCourses();
    const course = list.find((c) => c.id === courseId);
    if (!course) return false;

    const filtered = list.filter((c) => c.id !== courseId);
    setStorageData(STORAGE_KEYS.TEACHER_COURSES, filtered);

    // Remove from teacher
    const teacher = teacherService.getTeacherById(course.teacherId);
    if (teacher) {
      const courseIds = (teacher.assignedCourseIds || []).filter((id) => id !== courseId);
      teacherService.updateTeacher(teacher.id, { assignedCourseIds: courseIds });
    }

    activityService.log(
      'Course Assignment Removed',
      'courses',
      course.name,
      `Unassigned course "${course.name}" from ${course.teacherName}`
    );

    return true;
  },
};
