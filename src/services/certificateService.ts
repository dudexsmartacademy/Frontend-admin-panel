import { STORAGE_KEYS } from '../constants/storageKeys';
import { StudentCertificate } from '../types';
import { logActivity } from './activityService';

export const getCertificates = (): StudentCertificate[] => {
  const data = localStorage.getItem(STORAGE_KEYS.CERTIFICATES);
  return data ? JSON.parse(data) : [];
};

export const getCertificateById = (id: string): StudentCertificate | undefined => {
  const list = getCertificates();
  return list.find((c) => c.id === id || c.certificateNumber === id);
};

export const getCertificatesByStudent = (studentId: string): StudentCertificate[] => {
  return getCertificates().filter((c) => c.studentId === studentId);
};

export const issueCertificate = (data: Omit<StudentCertificate, 'id' | 'issuedDate'> & { issuedDate?: string }): StudentCertificate => {
  const list = getCertificates();
  const id = `cert-${Date.now()}`;
  const certificateNumber = `DX-CERT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  
  const newCert: StudentCertificate = {
    ...data,
    id,
    certificateNumber: data.certificateNumber || certificateNumber,
    issuedDate: data.issuedDate || new Date().toISOString().split('T')[0],
    status: data.status || 'Issued',
  };

  list.unshift(newCert);
  localStorage.setItem(STORAGE_KEYS.CERTIFICATES, JSON.stringify(list));

  logActivity({
    action: 'Issued Certificate',
    user: 'Super Admin',
    details: `Issued ${newCert.certificateNumber} for ${newCert.studentName} (${newCert.courseName})`,
    timestamp: new Date().toISOString(),
    status: 'success'
  });

  return newCert;
};

export const updateCertificateStatus = (id: string, status: StudentCertificate['status']): StudentCertificate | null => {
  const list = getCertificates();
  const idx = list.findIndex((c) => c.id === id);
  if (idx === -1) return null;

  list[idx].status = status;
  localStorage.setItem(STORAGE_KEYS.CERTIFICATES, JSON.stringify(list));

  logActivity({
    action: `Certificate ${status}`,
    user: 'Super Admin',
    details: `Updated certificate ${list[idx].certificateNumber} status to ${status}`,
    timestamp: new Date().toISOString(),
    status: 'success'
  });

  return list[idx];
};
