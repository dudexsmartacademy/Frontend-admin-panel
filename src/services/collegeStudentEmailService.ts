import { getStorageData, setStorageData } from '../utils/storage';

export interface CollegeStudentEmail {
  id: string;
  collegeId: string;
  collegeName: string;
  email: string;
  studentName?: string;
  studentId?: string;
  department?: string;
  uploadedAt: string;
  sourceFileName?: string;
  status: 'Active' | 'Verified' | 'Pending';
}

const STORAGE_KEY = 'dudex_college_student_emails';
const CHANGE_EVENT = 'dudex_college_student_emails_changed';

export const initialStudentEmails: CollegeStudentEmail[] = [
  // DudeX Institute of Technology (COL-001)
  {
    id: 'MAIL-001',
    collegeId: 'COL-001',
    collegeName: 'DudeX Institute of Technology',
    email: 'arjun.sharma@dit.dudex.edu',
    studentName: 'Arjun Sharma',
    studentId: 'STU-2024-001',
    department: 'CSE',
    uploadedAt: '2024-03-01T10:15:00.000Z',
    sourceFileName: 'dit_cs_roster_2024.csv',
    status: 'Verified',
  },
  {
    id: 'MAIL-002',
    collegeId: 'COL-001',
    collegeName: 'DudeX Institute of Technology',
    email: 'priya.nair@dit.dudex.edu',
    studentName: 'Priya Nair',
    studentId: 'STU-2024-002',
    department: 'AI & DS',
    uploadedAt: '2024-03-01T10:15:00.000Z',
    sourceFileName: 'dit_cs_roster_2024.csv',
    status: 'Verified',
  },
  {
    id: 'MAIL-003',
    collegeId: 'COL-001',
    collegeName: 'DudeX Institute of Technology',
    email: 'rohit.verma@dit.dudex.edu',
    studentName: 'Rohit Verma',
    studentId: 'STU-2024-003',
    department: 'Cyber Security',
    uploadedAt: '2024-03-01T10:15:00.000Z',
    sourceFileName: 'dit_cs_roster_2024.csv',
    status: 'Active',
  },
  {
    id: 'MAIL-004',
    collegeId: 'COL-001',
    collegeName: 'DudeX Institute of Technology',
    email: 'sneha.patel@dit.dudex.edu',
    studentName: 'Sneha Patel',
    studentId: 'STU-2024-004',
    department: 'IT',
    uploadedAt: '2024-03-02T11:20:00.000Z',
    sourceFileName: 'dit_it_students.xlsx',
    status: 'Verified',
  },
  {
    id: 'MAIL-005',
    collegeId: 'COL-001',
    collegeName: 'DudeX Institute of Technology',
    email: 'vikram.aditya@dit.dudex.edu',
    studentName: 'Vikram Aditya',
    studentId: 'STU-2024-005',
    department: 'CSE',
    uploadedAt: '2024-03-02T11:20:00.000Z',
    sourceFileName: 'dit_it_students.xlsx',
    status: 'Active',
  },

  // DudeX College of Engineering (COL-002)
  {
    id: 'MAIL-006',
    collegeId: 'COL-002',
    collegeName: 'DudeX College of Engineering',
    email: 'ananya.iyer@dce.dudex.edu',
    studentName: 'Ananya Iyer',
    studentId: 'STU-2024-012',
    department: 'CSE',
    uploadedAt: '2024-03-05T09:30:00.000Z',
    sourceFileName: 'dce_students_batch1.csv',
    status: 'Verified',
  },
  {
    id: 'MAIL-007',
    collegeId: 'COL-002',
    collegeName: 'DudeX College of Engineering',
    email: 'karthik.rajan@dce.dudex.edu',
    studentName: 'Karthik Rajan',
    studentId: 'STU-2024-015',
    department: 'AI & DS',
    uploadedAt: '2024-03-05T09:30:00.000Z',
    sourceFileName: 'dce_students_batch1.csv',
    status: 'Verified',
  },

  // Apex Institute of Technology (COL-003)
  {
    id: 'MAIL-008',
    collegeId: 'COL-003',
    collegeName: 'Apex Institute of Technology',
    email: 'dev.malhotra@ait.dudex.edu',
    studentName: 'Dev Malhotra',
    studentId: 'STU-2024-021',
    department: 'CSE',
    uploadedAt: '2024-03-10T14:45:00.000Z',
    sourceFileName: 'ait_registered_mail_ids.txt',
    status: 'Verified',
  },
  {
    id: 'MAIL-009',
    collegeId: 'COL-003',
    collegeName: 'Apex Institute of Technology',
    email: 'meera.joshi@ait.dudex.edu',
    studentName: 'Meera Joshi',
    studentId: 'STU-2024-022',
    department: 'BCA',
    uploadedAt: '2024-03-10T14:45:00.000Z',
    sourceFileName: 'ait_registered_mail_ids.txt',
    status: 'Active',
  },
];

function notifyChange(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }
}

export const collegeStudentEmailService = {
  getAllEmails(): CollegeStudentEmail[] {
    const data = getStorageData<CollegeStudentEmail[]>(STORAGE_KEY, []);
    if (!data || data.length === 0) {
      setStorageData(STORAGE_KEY, initialStudentEmails);
      return initialStudentEmails;
    }
    return data;
  },

  getEmailsByCollege(collegeId: string): CollegeStudentEmail[] {
    return this.getAllEmails().filter((e) => e.collegeId === collegeId);
  },

  addEmails(
    collegeId: string,
    collegeName: string,
    items: {
      email: string;
      studentName?: string;
      studentId?: string;
      department?: string;
    }[],
    sourceFileName: string = 'Uploaded File'
  ): {
    addedCount: number;
    duplicateCount: number;
    invalidCount: number;
    newRecords: CollegeStudentEmail[];
  } {
    const existing = this.getAllEmails();
    const collegeExistingEmails = new Set(
      existing
        .filter((e) => e.collegeId === collegeId)
        .map((e) => e.email.toLowerCase().trim())
    );

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const now = new Date().toISOString();

    const newRecords: CollegeStudentEmail[] = [];
    let duplicateCount = 0;
    let invalidCount = 0;

    for (const item of items) {
      const cleanEmail = item.email.trim().toLowerCase();
      if (!cleanEmail || !emailRegex.test(cleanEmail)) {
        invalidCount++;
        continue;
      }

      if (collegeExistingEmails.has(cleanEmail)) {
        duplicateCount++;
        continue;
      }

      collegeExistingEmails.add(cleanEmail);

      const record: CollegeStudentEmail = {
        id: `MAIL-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        collegeId,
        collegeName,
        email: cleanEmail,
        studentName: item.studentName?.trim() || cleanEmail.split('@')[0],
        studentId: item.studentId?.trim(),
        department: item.department?.trim(),
        uploadedAt: now,
        sourceFileName,
        status: 'Active',
      };

      newRecords.push(record);
    }

    if (newRecords.length > 0) {
      const updated = [...newRecords, ...existing];
      setStorageData(STORAGE_KEY, updated);
      notifyChange();
    }

    return {
      addedCount: newRecords.length,
      duplicateCount,
      invalidCount,
      newRecords,
    };
  },

  addSingleEmail(
    collegeId: string,
    collegeName: string,
    email: string,
    studentName?: string,
    studentId?: string,
    department?: string
  ): { success: boolean; message: string; record?: CollegeStudentEmail } {
    const res = this.addEmails(
      collegeId,
      collegeName,
      [{ email, studentName, studentId, department }],
      'Manual Entry'
    );

    if (res.addedCount > 0) {
      return {
        success: true,
        message: 'Student mail ID added successfully',
        record: res.newRecords[0],
      };
    }

    if (res.duplicateCount > 0) {
      return {
        success: false,
        message: 'This email is already registered for the selected college',
      };
    }

    return {
      success: false,
      message: 'Invalid email address format',
    };
  },

  deleteEmail(id: string): void {
    const list = this.getAllEmails().filter((e) => e.id !== id);
    setStorageData(STORAGE_KEY, list);
    notifyChange();
  },

  deleteEmails(ids: string[]): void {
    const set = new Set(ids);
    const list = this.getAllEmails().filter((e) => !set.has(e.id));
    setStorageData(STORAGE_KEY, list);
    notifyChange();
  },

  clearEmailsByCollege(collegeId: string): void {
    const list = this.getAllEmails().filter((e) => e.collegeId !== collegeId);
    setStorageData(STORAGE_KEY, list);
    notifyChange();
  },

  exportToCSV(collegeId: string): string {
    const list = this.getEmailsByCollege(collegeId);
    const headers = ['Email', 'Student Name', 'Student ID', 'Department', 'Uploaded Date', 'Status'];
    const rows = list.map((item) => [
      `"${item.email}"`,
      `"${item.studentName || ''}"`,
      `"${item.studentId || ''}"`,
      `"${item.department || ''}"`,
      `"${new Date(item.uploadedAt).toLocaleDateString()}"`,
      `"${item.status}"`,
    ]);

    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  },
};
