import { STORAGE_KEYS } from '../constants/storageKeys';
import { getStorageData, setStorageData } from '../utils/storage';
import { StudentQuery } from '../types';
import { activityService } from './activityService';

export const initialStudentQueries: StudentQuery[] = [
  {
    id: 'qry-101',
    queryCode: 'QRY-2026-081',
    studentId: 'stu-naveen-01',
    studentName: 'Naveen J.K.',
    studentAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
    studentEmail: 'naveen.jk@gmail.com',
    studentPhone: '+91 98765 43210',
    whatsappNumber: '+91 98765 43210',
    collegeName: 'DudeX Institute of Technology',
    department: 'Artificial Intelligence & Data Science',
    batch: 'Batch 1',
    section: 'Section B',
    category: 'Attendance Correction',
    subject: 'Attendance record correction for 28-Sep-2026 session',
    description:
      'I was present throughout the live coding lab session on 28th September 2026 from 10:00 AM to 12:00 PM and submitted my challenge solution on time. However, the portal has marked me absent in the daily roster. Kindly verify with the mentor and correct my attendance record.',
    priority: 'high',
    status: 'pending',
    submittedAt: '2026-09-29 11:20 AM',
    assignedFaculty: 'Prof. Alex Morgan',
  },
  {
    id: 'qry-102',
    queryCode: 'QRY-2026-082',
    studentId: 'stu-108',
    studentName: 'Priya Sharma',
    studentAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150',
    studentEmail: 'priya.sharma@dudex.academy',
    studentPhone: '+91 98451 23098',
    whatsappNumber: '+91 98451 23098',
    collegeName: 'DudeX Institute of Technology',
    department: 'Artificial Intelligence & Data Science',
    batch: 'Batch 1',
    section: 'Section A',
    category: 'Technical Issues',
    subject: 'HackerRank test terminal disconnection during Challenge 2',
    description:
      'During the DudeX AI Coding Challenge 2, the online browser IDE encountered repeated WebSocket disconnections around 10:45 AM. I was able to reconnect after 5 minutes and submit, but two test cases timed out. Requesting a manual verification of my code submission.',
    priority: 'medium',
    status: 'in_review',
    submittedAt: '2026-09-28 03:15 PM',
    assignedFaculty: 'Prof. Alex Morgan',
    adminResponse: 'Faculty is reviewing the backend server logs for the session window.',
  },
  {
    id: 'qry-103',
    queryCode: 'QRY-2026-083',
    studentId: 'stu-107',
    studentName: 'Arun Kumar',
    studentAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    studentEmail: 'arun.kumar@dudex.academy',
    studentPhone: '+91 97123 45678',
    whatsappNumber: '+91 97123 45678',
    collegeName: 'DudeX Institute of Technology',
    department: 'Artificial Intelligence & Data Science',
    batch: 'Batch 1',
    section: 'Section B',
    category: 'Exam / Assessment Query',
    subject: 'Clarification on Dynamic Programming scoring weightage',
    description:
      'In the recent AI coding challenge, my solution scored 26/30. I would like to understand the rubric breakdown for test case 9 which tested auxiliary space complexity. Could the evaluator provide detailed test case diagnostics?',
    priority: 'low',
    status: 'resolved',
    submittedAt: '2026-09-27 09:40 AM',
    resolvedAt: '2026-09-28 01:00 PM',
    assignedFaculty: 'Prof. Alex Morgan',
    adminResponse:
      'The rubric deducted 4 marks for quadratic auxiliary space allocation in recursion stack. Optimization feedback has been shared in your assessment report.',
  },
  {
    id: 'qry-104',
    queryCode: 'QRY-2026-084',
    studentId: 'stu-109',
    studentName: 'Rahul Raj',
    studentAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
    studentEmail: 'rahul.raj@dudex.academy',
    studentPhone: '+91 99887 65432',
    whatsappNumber: '+91 99887 65432',
    collegeName: 'DudeX College of Engineering',
    department: 'Computer Science & Engineering',
    batch: 'Batch 1',
    section: 'Section A',
    category: 'Course Content & Notes',
    subject: 'Request for Transformers & PyTorch lecture slide deck PDF',
    description:
      'The PDF slides for Module 4: Attention Mechanisms and Multi-Head Transformers are not downloading from the notes directory. Getting a 404 file path error. Kindly re-upload the latest session slides.',
    priority: 'medium',
    status: 'pending',
    submittedAt: '2026-09-30 05:00 PM',
    assignedFaculty: 'Prof. Alex Morgan',
  },
  {
    id: 'qry-105',
    queryCode: 'QRY-2026-085',
    studentId: 'stu-110',
    studentName: 'Sneha Joseph',
    studentAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150',
    studentEmail: 'sneha.joseph@dudex.academy',
    studentPhone: '+91 96543 21870',
    whatsappNumber: '+91 96543 21870',
    collegeName: 'Apex Institute of Technology',
    department: 'Information Technology',
    batch: 'Batch 1',
    section: 'Section B',
    category: 'Live Session Access',
    subject: 'Google Meet link not displaying on Dashboard Hero banner',
    description:
      'For the upcoming Saturday placement masterclass, the Google Meet button is not appearing on my student dashboard. I verified that my batch is Batch 1.',
    priority: 'high',
    status: 'in_review',
    submittedAt: '2026-10-01 08:30 AM',
    assignedFaculty: 'Prof. Alex Morgan',
    adminResponse: 'Permissions synced. Meet button is now enabled for your student account.',
  },
  {
    id: 'qry-106',
    queryCode: 'QRY-2026-086',
    studentId: 'stu-111',
    studentName: 'Vishal Kumar',
    studentAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=150',
    studentEmail: 'vishal.kumar@dudex.academy',
    studentPhone: '+91 95432 10987',
    whatsappNumber: '+91 95432 10987',
    collegeName: 'DudeX University of Technology',
    department: 'Artificial Intelligence & Data Science',
    batch: 'Batch 2',
    section: 'Section A',
    category: 'Technical Issues',
    subject: 'Result scorecard upload verification issue',
    description:
      'I completed the assessment and uploaded my screenshot PNG proof, but the confirmation banner took over a minute to process. Please confirm if my file was successfully received.',
    priority: 'low',
    status: 'resolved',
    submittedAt: '2026-09-28 11:00 AM',
    resolvedAt: '2026-09-28 02:30 PM',
    assignedFaculty: 'Prof. Alex Morgan',
    adminResponse: 'Screenshot received and verified in faculty assessment registry.',
  },
];

export const getStudentQueries = (): StudentQuery[] => {
  return getStorageData<StudentQuery[]>(
    STORAGE_KEYS.STUDENT_QUERIES,
    initialStudentQueries
  );
};

export const getStudentQueryById = (id: string): StudentQuery | undefined => {
  const queries = getStudentQueries();
  return queries.find((q) => q.id === id || q.queryCode === id);
};

export const getStudentQueriesByStudent = (studentId: string): StudentQuery[] => {
  const queries = getStudentQueries();
  return queries.filter((q) => q.studentId === studentId);
};

export const createStudentQuery = (
  data: Omit<StudentQuery, 'id' | 'queryCode' | 'submittedAt'> & {
    id?: string;
    queryCode?: string;
  }
): StudentQuery => {
  const queries = getStudentQueries();
  const count = queries.length + 1;
  const year = new Date().getFullYear();

  const newQuery: StudentQuery = {
    id: data.id || `qry-${Date.now()}`,
    queryCode: data.queryCode || `QRY-${year}-${String(count).padStart(3, '0')}`,
    submittedAt: new Date().toLocaleString(),
    ...data,
  };

  const updated = [newQuery, ...queries];
  setStorageData(STORAGE_KEYS.STUDENT_QUERIES, updated);

  activityService.log(
    'Student Query Submitted',
    'students',
    newQuery.studentName,
    `New query submitted: "${newQuery.subject || newQuery.category}" by ${newQuery.studentName}`
  );

  return newQuery;
};

export const updateStudentQuery = (
  id: string,
  updates: Partial<StudentQuery>
): StudentQuery | null => {
  const queries = getStudentQueries();
  const index = queries.findIndex((q) => q.id === id || q.queryCode === id);
  if (index === -1) return null;

  const current = queries[index];
  const updatedItem: StudentQuery = {
    ...current,
    ...updates,
    ...(updates.status === 'resolved' && !current.resolvedAt
      ? { resolvedAt: new Date().toLocaleString() }
      : {}),
  };

  queries[index] = updatedItem;
  setStorageData(STORAGE_KEYS.STUDENT_QUERIES, queries);

  activityService.log(
    'Student Query Updated',
    'students',
    updatedItem.studentName,
    `Updated query [${updatedItem.queryCode}] status to "${updatedItem.status}" for ${updatedItem.studentName}`
  );

  return updatedItem;
};

export const deleteStudentQuery = (id: string): boolean => {
  const queries = getStudentQueries();
  const target = queries.find((q) => q.id === id || q.queryCode === id);
  if (!target) return false;

  const filtered = queries.filter((q) => q.id !== id && q.queryCode !== id);
  setStorageData(STORAGE_KEYS.STUDENT_QUERIES, filtered);

  activityService.log(
    'Student Query Removed',
    'students',
    target.studentName,
    `Removed query [${target.queryCode}] for ${target.studentName}`
  );

  return true;
};

export const studentQueryService = {
  getStudentQueries,
  getStudentQueryById,
  getStudentQueriesByStudent,
  createStudentQuery,
  updateStudentQuery,
  deleteStudentQuery,
};
