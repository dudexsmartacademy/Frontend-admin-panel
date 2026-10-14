import { STORAGE_KEYS } from '../constants/storageKeys';
import { getStorageData, setStorageData } from '../utils/storage';
import { StudentAttendance, StudentAttendanceSummary, AttendanceStatus } from '../types';
import { studentService } from './studentService';
import { activityService } from './activityService';

export const getStudentAttendance = (studentId?: string): StudentAttendance[] => {
  const list = getStorageData<StudentAttendance[]>(STORAGE_KEYS.STUDENT_ATTENDANCE, []);
  if (studentId) {
    return list.filter((a) => a.studentId === studentId);
  }
  return list;
};

export const getAttendanceRecords = getStudentAttendance;

export const getAttendanceByStudentId = (studentId: string): StudentAttendance[] => {
  return getStudentAttendance(studentId);
};

export const getAttendanceById = (id: string): StudentAttendance | undefined => {
  const list = getStudentAttendance();
  return list.find((a) => a.id === id);
};

export const recordStudentAttendance = (data: Partial<StudentAttendance> & {
  studentId: string;
  studentName: string;
  courseName: string;
  batchName: string;
  subjectName: string;
  teacherName: string;
  date: string;
  status: StudentAttendance['status'];
}): StudentAttendance => {
  const list = getStudentAttendance();
  const newRecord: StudentAttendance = {
    id: `satt-${Date.now()}`,
    studentId: data.studentId,
    studentName: data.studentName,
    courseName: data.courseName,
    batchName: data.batchName,
    subject: data.subject || data.subjectName || 'Core Module',
    subjectName: data.subjectName || data.subject || 'Core Module',
    teacherName: data.teacherName,
    date: data.date,
    session: data.session || 'Regular Session',
    status: data.status,
    remarks: data.remarks || 'Regular attendance',
    updatedAt: new Date().toISOString(),
    ...data,
  };

  const updated = [newRecord, ...list];
  setStorageData(STORAGE_KEYS.STUDENT_ATTENDANCE, updated);
  recalculateStudentAttendancePercentage(data.studentId);

  activityService.log(
    'Student Attendance Recorded',
    'attendance',
    data.studentName,
    `Recorded ${String(data.status).toUpperCase()} for ${data.studentName} in ${newRecord.subjectName} on ${data.date}`
  );

  return newRecord;
};

export const updateStudentAttendanceRecord = (
  id: string,
  updates: Partial<StudentAttendance>
): StudentAttendance | null => {
  const list = getStudentAttendance();
  const index = list.findIndex((a) => a.id === id);
  if (index === -1) return null;

  const updatedRecord = {
    ...list[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  list[index] = updatedRecord;
  setStorageData(STORAGE_KEYS.STUDENT_ATTENDANCE, list);
  recalculateStudentAttendancePercentage(updatedRecord.studentId);

  activityService.log(
    'Student Attendance Corrected',
    'attendance',
    updatedRecord.studentName,
    `Updated attendance status to ${updatedRecord.status} for ${updatedRecord.studentName} on ${updatedRecord.date}`
  );

  return updatedRecord;
};

export const recalculateStudentAttendancePercentage = (studentId: string): void => {
  const records = getStudentAttendance(studentId);
  if (records.length === 0) return;

  const presentCount = records.filter(
    (r) => r.status === 'Present' || r.status === 'present' || r.status === 'Late' || r.status === 'late' || r.status === 'Excused'
  ).length;
  const totalConsidered = records.filter(
    (r) =>
      r.status !== 'Not Applicable' &&
      r.status !== 'not_applicable' &&
      r.status !== 'Not Marked' &&
      r.status !== 'not_marked'
  ).length;

  if (totalConsidered === 0) return;

  const rate = Math.round((presentCount / totalConsidered) * 100);
  studentService.updateStudent(studentId, { attendancePercentage: rate });
};

export const getStudentAttendanceSummary = (studentId: string): StudentAttendanceSummary | null => {
  const student = studentService.getStudentById(studentId);
  if (!student) return null;

  const records = getStudentAttendance(studentId);
  const totalConducted = records.filter(
    (r) => r.status !== 'Not Marked' && r.status !== 'not_marked'
  ).length;
  const present = records.filter((r) => r.status === 'Present' || r.status === 'present').length;
  const absent = records.filter((r) => r.status === 'Absent' || r.status === 'absent').length;
  const late = records.filter((r) => r.status === 'Late' || r.status === 'late').length;
  const excused = records.filter((r) => r.status === 'Excused' || r.status === 'excused').length;
  const pct = student.attendancePercentage || (totalConducted ? Math.round(((present + late + excused) / totalConducted) * 100) : 100);

  let riskStatus: 'safe' | 'warning' | 'critical' = 'safe';
  if (pct < 75) riskStatus = 'critical';
  else if (pct < 85) riskStatus = 'warning';

  return {
    studentId: student.id,
    studentName: student.fullName,
    studentIdCode: student.studentId,
    courseName: student.course || student.courseName || '',
    batchName: student.batch || student.batchName || '',
    totalConducted,
    present,
    absent,
    late,
    excused,
    percentage: pct,
    riskStatus,
  };
};

export const saveBulkBatchAttendance = (
  items: {
    studentId: string;
    studentName: string;
    batchName: string;
    date: string;
    status: AttendanceStatus;
  }[]
): StudentAttendance[] => {
  const list = getStudentAttendance();
  const updatedList = [...list];

  items.forEach((item) => {
    const existingIndex = updatedList.findIndex(
      (r) => r.studentId === item.studentId && r.date === item.date
    );
    if (existingIndex >= 0) {
      updatedList[existingIndex] = {
        ...updatedList[existingIndex],
        status: item.status,
        updatedAt: new Date().toISOString(),
      };
    } else {
      updatedList.unshift({
        id: `satt-${Date.now()}-${item.studentId}`,
        studentId: item.studentId,
        studentName: item.studentName,
        courseName: 'Core Engineering Program',
        batchName: item.batchName,
        subject: 'General Academic Session',
        subjectName: 'General Academic Session',
        teacherName: 'Faculty In-Charge',
        date: item.date,
        session: 'Regular Class',
        status: item.status,
        remarks: `Marked ${item.status}`,
        updatedAt: new Date().toISOString(),
      });
    }
    recalculateStudentAttendancePercentage(item.studentId);
  });

  setStorageData(STORAGE_KEYS.STUDENT_ATTENDANCE, updatedList);
  if (items.length > 0) {
    activityService.log(
      'Batch Attendance Saved',
      'attendance',
      items[0].batchName || 'Batch',
      `Saved daily attendance for ${items.length} students on ${items[0].date}`
    );
  }
  return updatedList;
};

export const studentAttendanceService = {
  getAttendanceRecords: getStudentAttendance,
  getAttendanceByStudentId: getStudentAttendance,
  getAttendanceById,
  recordAttendance: recordStudentAttendance,
  updateAttendance: updateStudentAttendanceRecord,
  saveBulkBatchAttendance,
  recalculateStudentAttendancePercentage,
  getStudentSummary: getStudentAttendanceSummary,
  getSubjectWiseAttendance: (studentId: string) => {
    const records = getStudentAttendance(studentId);
    const map = new Map<string, { conducted: number; present: number; absent: number }>();

    records.forEach((r) => {
      const subj = r.subjectName || r.subject || 'General';
      const current = map.get(subj) || { conducted: 0, present: 0, absent: 0 };
      current.conducted += 1;
      if (r.status === 'Present' || r.status === 'present' || r.status === 'Late' || r.status === 'late') {
        current.present += 1;
      } else {
        current.absent += 1;
      }
      map.set(subj, current);
    });

    if (map.size === 0) {
      return [
        { subject: 'Python', conducted: 14, present: 13, absent: 1, percentage: 91 },
        { subject: 'Data Science', conducted: 13, present: 11, absent: 2, percentage: 84 },
        { subject: 'DBMS', conducted: 13, present: 10, absent: 3, percentage: 78 },
        { subject: 'Mathematics', conducted: 10, present: 7, absent: 3, percentage: 74 },
      ];
    }

    return Array.from(map.entries()).map(([subject, data]) => ({
      subject,
      conducted: data.conducted,
      present: data.present,
      absent: data.absent,
      percentage: data.conducted ? Math.round((data.present / data.conducted) * 100) : 100,
    }));
  },
};
