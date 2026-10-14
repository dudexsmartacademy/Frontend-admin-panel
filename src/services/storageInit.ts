import { STORAGE_KEYS } from '../constants/storageKeys';
import { getStorageData, setStorageData } from '../utils/storage';
import {
  initialAdminProfile,
  initialSettings,
  initialTeachers,
  initialApplications,
  initialCourses,
  initialClasses,
  initialAttendance,
  initialLeaves,
  initialAssignments,
  initialSubmissions,
  initialActivityLogs,
  initialNotifications,
  initialStudents,
  initialAdmissions,
  initialEnrollments,
  initialStudentAttendance,
  initialExams,
  initialResults,
  initialFeeRecords,
  initialPayments,
  initialCertificates,
  initialAcademicCourses,
  initialAcademicSubjects,
  initialAcademicBatches,
  initialAcademicClasses,
  initialClassrooms,
  initialCalendarEvents,
  initialAnnouncements,
  initialCentralNotifications,
  initialRolesPermissions,
  initialAdminUsers,
  initialContentSections,
  initialSlideBanners,
  initialStorageFiles,
} from '../data/mockData';

export function initializeStorage(): void {
  if (!getStorageData(STORAGE_KEYS.ADMIN_PROFILE, null)) {
    setStorageData(STORAGE_KEYS.ADMIN_PROFILE, initialAdminProfile);
  }
  if (!getStorageData(STORAGE_KEYS.SETTINGS, null)) {
    setStorageData(STORAGE_KEYS.SETTINGS, initialSettings);
  }
  if (!getStorageData(STORAGE_KEYS.TEACHERS, null)) {
    setStorageData(STORAGE_KEYS.TEACHERS, initialTeachers);
  }
  if (!getStorageData(STORAGE_KEYS.TEACHER_APPLICATIONS, null)) {
    setStorageData(STORAGE_KEYS.TEACHER_APPLICATIONS, initialApplications);
  }
  if (!getStorageData(STORAGE_KEYS.TEACHER_COURSES, null)) {
    setStorageData(STORAGE_KEYS.TEACHER_COURSES, initialCourses);
  }
  if (!getStorageData(STORAGE_KEYS.TEACHER_CLASSES, null)) {
    setStorageData(STORAGE_KEYS.TEACHER_CLASSES, initialClasses);
  }
  if (!getStorageData(STORAGE_KEYS.TEACHER_ATTENDANCE, null)) {
    setStorageData(STORAGE_KEYS.TEACHER_ATTENDANCE, initialAttendance);
  }
  if (!getStorageData(STORAGE_KEYS.TEACHER_LEAVE, null)) {
    setStorageData(STORAGE_KEYS.TEACHER_LEAVE, initialLeaves);
  }
  if (!getStorageData(STORAGE_KEYS.TEACHER_ASSIGNMENTS, null)) {
    setStorageData(STORAGE_KEYS.TEACHER_ASSIGNMENTS, initialAssignments);
  }
  if (!getStorageData(STORAGE_KEYS.TEACHER_ASSIGNMENT_SUBMISSIONS, null)) {
    setStorageData(STORAGE_KEYS.TEACHER_ASSIGNMENT_SUBMISSIONS, initialSubmissions);
  }
  if (!getStorageData(STORAGE_KEYS.ACTIVITY_LOGS, null)) {
    setStorageData(STORAGE_KEYS.ACTIVITY_LOGS, initialActivityLogs);
  }
  if (!getStorageData(STORAGE_KEYS.NOTIFICATIONS, null)) {
    setStorageData(STORAGE_KEYS.NOTIFICATIONS, initialNotifications);
  }

  // Phase 2: Student & Academic Management initialization
  if (!getStorageData(STORAGE_KEYS.STUDENTS, null)) {
    setStorageData(STORAGE_KEYS.STUDENTS, initialStudents);
  }
  if (!getStorageData(STORAGE_KEYS.ADMISSIONS, null)) {
    setStorageData(STORAGE_KEYS.ADMISSIONS, initialAdmissions);
  }
  if (!getStorageData(STORAGE_KEYS.ENROLLMENTS, null)) {
    setStorageData(STORAGE_KEYS.ENROLLMENTS, initialEnrollments);
  }
  if (!getStorageData(STORAGE_KEYS.STUDENT_ATTENDANCE, null)) {
    setStorageData(STORAGE_KEYS.STUDENT_ATTENDANCE, initialStudentAttendance);
  }
  if (!getStorageData(STORAGE_KEYS.EXAMS, null)) {
    setStorageData(STORAGE_KEYS.EXAMS, initialExams);
  }
  if (!getStorageData(STORAGE_KEYS.RESULTS, null)) {
    setStorageData(STORAGE_KEYS.RESULTS, initialResults);
  }
  if (!getStorageData(STORAGE_KEYS.FEES, null)) {
    setStorageData(STORAGE_KEYS.FEES, initialFeeRecords);
  }
  if (!getStorageData(STORAGE_KEYS.PAYMENTS, null)) {
    setStorageData(STORAGE_KEYS.PAYMENTS, initialPayments);
  }
  if (!getStorageData(STORAGE_KEYS.CERTIFICATES, null)) {
    setStorageData(STORAGE_KEYS.CERTIFICATES, initialCertificates);
  }
  if (!getStorageData(STORAGE_KEYS.ACADEMIC_COURSES, null)) {
    setStorageData(STORAGE_KEYS.ACADEMIC_COURSES, initialAcademicCourses);
  }
  if (!getStorageData(STORAGE_KEYS.ACADEMIC_SUBJECTS, null)) {
    setStorageData(STORAGE_KEYS.ACADEMIC_SUBJECTS, initialAcademicSubjects);
  }
  if (!getStorageData(STORAGE_KEYS.ACADEMIC_BATCHES, null)) {
    setStorageData(STORAGE_KEYS.ACADEMIC_BATCHES, initialAcademicBatches);
  }
  if (!getStorageData(STORAGE_KEYS.ACADEMIC_CLASSES, null)) {
    setStorageData(STORAGE_KEYS.ACADEMIC_CLASSES, initialAcademicClasses);
  }

  // Phase 3: General Management initialization
  if (!getStorageData(STORAGE_KEYS.CLASSROOMS, null)) {
    setStorageData(STORAGE_KEYS.CLASSROOMS, initialClassrooms);
  }
  if (!getStorageData(STORAGE_KEYS.CALENDAR_EVENTS, null)) {
    setStorageData(STORAGE_KEYS.CALENDAR_EVENTS, initialCalendarEvents);
  }
  if (!getStorageData(STORAGE_KEYS.ANNOUNCEMENTS, null)) {
    setStorageData(STORAGE_KEYS.ANNOUNCEMENTS, initialAnnouncements);
  }
  if (!getStorageData(STORAGE_KEYS.CENTRAL_NOTIFICATIONS, null)) {
    setStorageData(STORAGE_KEYS.CENTRAL_NOTIFICATIONS, initialCentralNotifications);
  }
  if (!getStorageData(STORAGE_KEYS.ROLES_PERMISSIONS, null)) {
    setStorageData(STORAGE_KEYS.ROLES_PERMISSIONS, initialRolesPermissions);
  }
  if (!getStorageData(STORAGE_KEYS.ADMIN_USERS, null)) {
    setStorageData(STORAGE_KEYS.ADMIN_USERS, initialAdminUsers);
  }
  if (!getStorageData(STORAGE_KEYS.CONTENT_SECTIONS, null)) {
    setStorageData(STORAGE_KEYS.CONTENT_SECTIONS, initialContentSections);
  }
  if (!getStorageData(STORAGE_KEYS.SLIDE_BANNERS, null)) {
    setStorageData(STORAGE_KEYS.SLIDE_BANNERS, initialSlideBanners);
  }
  if (!getStorageData(STORAGE_KEYS.STORAGE_FILES, null)) {
    setStorageData(STORAGE_KEYS.STORAGE_FILES, initialStorageFiles);
  }
}
