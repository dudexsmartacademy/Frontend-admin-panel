import { STORAGE_KEYS } from '../constants/storageKeys';
import { getStorageData, setStorageData } from '../utils/storage';
import { TeacherApplication, ApplicationStatus, Teacher } from '../types';
import { activityService } from './activityService';
import { teacherService } from './teacherService';

export const teacherApplicationService = {
  getApplications(): TeacherApplication[] {
    return getStorageData<TeacherApplication[]>(STORAGE_KEYS.TEACHER_APPLICATIONS, []);
  },

  getApplicationById(id: string): TeacherApplication | undefined {
    const list = this.getApplications();
    return list.find((a) => a.id === id || a.applicationNumber === id);
  },

  updateApplicationStatus(
    id: string,
    status: ApplicationStatus,
    reviewerNotes?: string
  ): TeacherApplication | null {
    const list = this.getApplications();
    const index = list.findIndex((a) => a.id === id || a.applicationNumber === id);
    if (index === -1) return null;

    const current = list[index];
    const updated: TeacherApplication = {
      ...current,
      status,
      reviewedDate: new Date().toISOString(),
      reviewerNotes: reviewerNotes || current.reviewerNotes,
    };

    list[index] = updated;
    setStorageData(STORAGE_KEYS.TEACHER_APPLICATIONS, list);

    activityService.log(
      `Application Status ${status.toUpperCase()}`,
      'applications',
      updated.fullName,
      `Updated application ${updated.applicationNumber} for ${updated.fullName} to status "${status}"`
    );

    return updated;
  },

  convertToTeacher(applicationId: string, additionalDetails?: Partial<Teacher>): { teacher: Teacher; application: TeacherApplication } | null {
    const app = this.getApplicationById(applicationId);
    if (!app) return null;

    const newTeacherId = teacherService.generateNextTeacherId();
    const createdTeacher = teacherService.createTeacher({
      teacherId: newTeacherId,
      fullName: app.fullName,
      email: app.email,
      phone: app.phone,
      dob: app.dob || '1990-01-01',
      gender: app.gender || 'male',
      address: app.address || 'Campus Faculty Residence',
      department: app.department,
      designation: 'Assistant Professor',
      qualification: app.qualification,
      experienceYears: app.experienceYears,
      joiningDate: new Date().toISOString().split('T')[0],
      employmentType: 'full-time',
      primarySubject: app.requestedSubject,
      skills: app.skills || [],
      bio: app.coverLetter || '',
      portfolioUrl: app.portfolioUrl,
      loginEmail: app.email,
      status: 'active',
      ...additionalDetails,
    });

    // Mark application as converted
    const updatedApp = this.updateApplicationStatus(app.id, 'converted', `Converted to faculty account (${newTeacherId})`);

    activityService.log(
      'Applicant Converted to Faculty',
      'applications',
      app.fullName,
      `Converted application ${app.applicationNumber} to active Faculty member ${createdTeacher.fullName} (${newTeacherId})`
    );

    return { teacher: createdTeacher, application: updatedApp || app };
  },

  deleteApplication(id: string): boolean {
    const list = this.getApplications();
    const filtered = list.filter((a) => a.id !== id);
    setStorageData(STORAGE_KEYS.TEACHER_APPLICATIONS, filtered);
    return true;
  },
};
