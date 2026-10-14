import { STORAGE_KEYS } from '../constants/storageKeys';
import { getStorageData, setStorageData } from '../utils/storage';
import { TeacherAttendance, AttendanceStatus } from '../types';
import { activityService } from './activityService';
import { teacherService } from './teacherService';

export const teacherAttendanceService = {
  getAttendanceRecords(): TeacherAttendance[] {
    return getStorageData<TeacherAttendance[]>(STORAGE_KEYS.TEACHER_ATTENDANCE, []);
  },

  getAttendanceByTeacherId(teacherId: string): TeacherAttendance[] {
    const list = this.getAttendanceRecords();
    return list.filter((a) => a.teacherId === teacherId);
  },

  getRecordById(id: string): TeacherAttendance | undefined {
    const list = this.getAttendanceRecords();
    return list.find((a) => a.id === id);
  },

  recordAttendance(data: Omit<TeacherAttendance, 'id' | 'updatedAt'>): TeacherAttendance {
    const list = this.getAttendanceRecords();
    const newRecord: TeacherAttendance = {
      ...data,
      id: `att-${Date.now()}`,
      updatedAt: new Date().toISOString(),
    };

    const updated = [newRecord, ...list];
    setStorageData(STORAGE_KEYS.TEACHER_ATTENDANCE, updated);
    this.recalculateTeacherAttendanceRate(data.teacherId);

    activityService.log(
      'Attendance Logged',
      'attendance',
      data.teacherName,
      `Recorded ${data.status.toUpperCase()} attendance for ${data.teacherName} on ${data.date}`
    );

    return newRecord;
  },

  updateAttendance(id: string, updates: Partial<TeacherAttendance>): TeacherAttendance | null {
    const list = this.getAttendanceRecords();
    const index = list.findIndex((a) => a.id === id);
    if (index === -1) return null;

    const updatedRecord = {
      ...list[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    list[index] = updatedRecord;
    setStorageData(STORAGE_KEYS.TEACHER_ATTENDANCE, list);
    this.recalculateTeacherAttendanceRate(updatedRecord.teacherId);

    activityService.log(
      'Attendance Updated',
      'attendance',
      updatedRecord.teacherName,
      `Updated attendance status to ${updatedRecord.status} for ${updatedRecord.teacherName} on ${updatedRecord.date}`
    );

    return updatedRecord;
  },

  recalculateTeacherAttendanceRate(teacherId: string): void {
    const records = this.getAttendanceByTeacherId(teacherId);
    if (records.length === 0) return;

    const presentOrLate = records.filter(
      (r) => r.status === 'present' || r.status === 'late'
    ).length;
    const totalConsidered = records.filter((r) => r.status !== 'holiday').length;

    if (totalConsidered === 0) return;

    const rate = Math.round((presentOrLate / totalConsidered) * 1000) / 10;
    teacherService.updateTeacher(teacherId, { attendanceRate: rate });
  },

  getTodaySummary(): {
    total: number;
    present: number;
    late: number;
    absent: number;
    onLeave: number;
    missingPunch: number;
  } {
    const today = new Date().toISOString().split('T')[0];
    const records = this.getAttendanceRecords().filter((r) => r.date === today || r.date === '2026-09-29');

    return {
      total: records.length,
      present: records.filter((r) => r.status === 'present').length,
      late: records.filter((r) => r.status === 'late').length,
      absent: records.filter((r) => r.status === 'absent').length,
      onLeave: records.filter((r) => r.status === 'on_leave').length,
      missingPunch: records.filter((r) => r.status === 'missing_punch').length,
    };
  },
};
