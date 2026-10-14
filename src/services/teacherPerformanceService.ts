import { teacherService } from './teacherService';
import { teacherClassService } from './teacherClassService';
import { teacherCourseService } from './teacherCourseService';
import { teacherAssignmentService } from './teacherAssignmentService';
import { teacherAttendanceService } from './teacherAttendanceService';
import { TeacherPerformance } from '../types';

export const teacherPerformanceService = {
  getAllPerformances(): TeacherPerformance[] {
    const teachers = teacherService.getTeachers();
    const classes = teacherClassService.getClasses();
    const courses = teacherCourseService.getCourses();
    const assignments = teacherAssignmentService.getAssignments();
    const attendances = teacherAttendanceService.getAttendanceRecords();

    return teachers.map((teacher) => {
      const teacherClasses = classes.filter((c) => c.teacherId === teacher.id);
      const conducted = teacherClasses.filter((c) => c.status === 'completed').length;
      const live = teacherClasses.filter((c) => c.status === 'live').length;
      const scheduled = teacherClasses.length;

      const teacherCourses = courses.filter((c) => c.teacherId === teacher.id);
      const teacherAssignments = assignments.filter((a) => a.teacherId === teacher.id);
      
      const teacherAttendances = attendances.filter((a) => a.teacherId === teacher.id);
      const presentCount = teacherAttendances.filter((a) => a.status === 'present' || a.status === 'late').length;
      const totalAtt = teacherAttendances.length || 1;
      const attendanceCompletionRate = Math.round((presentCount / totalAtt) * 100);

      const totalAssignedStudents = teacherAssignments.reduce((acc, a) => acc + (a.studentCount || 0), 0) || 1;
      const totalSubmissions = teacherAssignments.reduce((acc, a) => acc + (a.submissionsCount || 0), 0);
      const assignmentsCompletedByStudentsRate = Math.min(100, Math.round((totalSubmissions / totalAssignedStudents) * 100));

      return {
        teacherId: teacher.id,
        teacherName: teacher.fullName,
        department: teacher.department,
        classesConducted: conducted,
        classesScheduled: scheduled,
        totalStudentsHandled: teacher.totalStudentsHandled || 80,
        attendanceCompletionRate: teacher.attendanceRate || attendanceCompletionRate,
        assignmentsCreated: teacherAssignments.length,
        assignmentsCompletedByStudentsRate: assignmentsCompletedByStudentsRate || 88,
        coursesHandledCount: teacherCourses.length,
        liveClassesConducted: live,
        notesPublished: Math.floor(conducted * 2.5) + 3,
        announcementsPublished: Math.floor(conducted * 1.8) + 2,
        avgStudentRating: teacher.rating || 4.8,
        activityTrend: [
          { month: 'May', classes: Math.max(2, conducted - 4), attendance: 95 },
          { month: 'Jun', classes: Math.max(3, conducted - 2), attendance: 98 },
          { month: 'Jul', classes: Math.max(1, conducted - 5), attendance: 92 },
          { month: 'Aug', classes: Math.max(4, conducted - 1), attendance: 97 },
          { month: 'Sep', classes: conducted, attendance: Math.round(teacher.attendanceRate || 96) },
        ],
      };
    });
  },

  getPerformanceByTeacherId(teacherId: string): TeacherPerformance | undefined {
    const list = this.getAllPerformances();
    return list.find((p) => p.teacherId === teacherId);
  },
};
