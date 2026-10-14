import { STORAGE_KEYS } from '../constants/storageKeys';
import { getStorageData, setStorageData } from '../utils/storage';
import { TeacherLeave, LeaveStatus } from '../types';
import { activityService } from './activityService';
import { teacherAttendanceService } from './teacherAttendanceService';

export const teacherLeaveService = {
  getLeaveRequests(): TeacherLeave[] {
    return getStorageData<TeacherLeave[]>(STORAGE_KEYS.TEACHER_LEAVE, []);
  },

  getLeaveById(id: string): TeacherLeave | undefined {
    const list = this.getLeaveRequests();
    return list.find((l) => l.id === id);
  },

  submitLeaveRequest(data: Omit<TeacherLeave, 'id' | 'submittedDate' | 'status'>): TeacherLeave {
    const list = this.getLeaveRequests();
    const newLeave: TeacherLeave = {
      ...data,
      id: `lea-${Date.now()}`,
      submittedDate: new Date().toISOString(),
      status: 'pending',
    };

    const updated = [newLeave, ...list];
    setStorageData(STORAGE_KEYS.TEACHER_LEAVE, updated);

    activityService.log(
      'Leave Request Submitted',
      'leave',
      data.teacherName,
      `Submitted ${data.leaveType} leave request for ${data.totalDays} day(s) (${data.fromDate} to ${data.toDate})`
    );

    return newLeave;
  },

  updateLeaveStatus(
    id: string,
    status: LeaveStatus,
    reviewerNotes?: string,
    adminName = 'Dr. Alexander Vance'
  ): TeacherLeave | null {
    const list = this.getLeaveRequests();
    const index = list.findIndex((l) => l.id === id);
    if (index === -1) return null;

    const current = list[index];
    const updated: TeacherLeave = {
      ...current,
      status,
      reviewedBy: adminName,
      reviewedDate: new Date().toISOString(),
      reviewRemarks: reviewerNotes || current.reviewRemarks,
    };

    list[index] = updated;
    setStorageData(STORAGE_KEYS.TEACHER_LEAVE, list);

    // If approved, update or insert attendance on that date as 'on_leave'
    if (status === 'approved') {
      teacherAttendanceService.recordAttendance({
        teacherId: updated.teacherId,
        teacherName: updated.teacherName,
        facultyId: 'FACULTY',
        department: updated.department,
        date: updated.fromDate,
        checkInTime: '-',
        checkOutTime: '-',
        durationMinutes: 0,
        status: 'on_leave',
        remarks: `Approved ${updated.leaveType} leave: ${updated.reason}`,
        recordedBy: `Admin (${adminName})`,
      });
    }

    activityService.log(
      `Leave Request ${status === 'approved' ? 'Approved' : 'Rejected'}`,
      'leave',
      updated.teacherName,
      `${status === 'approved' ? 'Approved' : 'Rejected'} leave request for ${updated.teacherName} (${updated.totalDays} days)`
    );

    return updated;
  },

  deleteLeave(id: string): boolean {
    const list = this.getLeaveRequests();
    const filtered = list.filter((l) => l.id !== id);
    setStorageData(STORAGE_KEYS.TEACHER_LEAVE, filtered);
    return true;
  },
};
