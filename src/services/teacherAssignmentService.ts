import { STORAGE_KEYS } from '../constants/storageKeys';
import { getStorageData, setStorageData } from '../utils/storage';
import { TeacherAssignment, AssignmentSubmission, AssignmentStatus } from '../types';
import { activityService } from './activityService';

export const teacherAssignmentService = {
  getAssignments(): TeacherAssignment[] {
    return getStorageData<TeacherAssignment[]>(STORAGE_KEYS.TEACHER_ASSIGNMENTS, []);
  },

  getAssignmentsByTeacherId(teacherId: string): TeacherAssignment[] {
    const list = this.getAssignments();
    return list.filter((a) => a.teacherId === teacherId);
  },

  getAssignmentById(id: string): TeacherAssignment | undefined {
    const list = this.getAssignments();
    return list.find((a) => a.id === id);
  },

  getSubmissions(assignmentId?: string): AssignmentSubmission[] {
    const list = getStorageData<AssignmentSubmission[]>(STORAGE_KEYS.TEACHER_ASSIGNMENT_SUBMISSIONS, []);
    if (assignmentId) {
      return list.filter((s) => s.assignmentId === assignmentId);
    }
    return list;
  },

  createAssignment(data: Omit<TeacherAssignment, 'id' | 'submissionsCount' | 'gradedCount' | 'lateSubmissionsCount'>): TeacherAssignment {
    const list = this.getAssignments();
    const newAssignment: TeacherAssignment = {
      ...data,
      id: `asg-${Date.now()}`,
      submissionsCount: 0,
      gradedCount: 0,
      lateSubmissionsCount: 0,
    };

    const updated = [newAssignment, ...list];
    setStorageData(STORAGE_KEYS.TEACHER_ASSIGNMENTS, updated);

    activityService.log(
      'Assignment Created',
      'assignments',
      newAssignment.title,
      `Created new academic assignment "${newAssignment.title}" for ${newAssignment.courseName}`
    );

    return newAssignment;
  },

  updateAssignment(id: string, updates: Partial<TeacherAssignment>): TeacherAssignment | null {
    const list = this.getAssignments();
    const index = list.findIndex((a) => a.id === id);
    if (index === -1) return null;

    list[index] = { ...list[index], ...updates };
    setStorageData(STORAGE_KEYS.TEACHER_ASSIGNMENTS, list);

    activityService.log(
      'Assignment Updated',
      'assignments',
      list[index].title,
      `Updated assignment details for "${list[index].title}"`
    );

    return list[index];
  },

  updateStatus(id: string, status: AssignmentStatus): TeacherAssignment | null {
    return this.updateAssignment(id, { status });
  },

  deleteAssignment(id: string): boolean {
    const list = this.getAssignments();
    const target = list.find((a) => a.id === id);
    if (!target) return false;

    const filtered = list.filter((a) => a.id !== id);
    setStorageData(STORAGE_KEYS.TEACHER_ASSIGNMENTS, filtered);

    activityService.log(
      'Assignment Deleted',
      'assignments',
      target.title,
      `Deleted assignment "${target.title}"`
    );

    return true;
  },
};
