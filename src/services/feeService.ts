import { STORAGE_KEYS } from '../constants/storageKeys';
import { getStorageData, setStorageData } from '../utils/storage';
import { FeeRecord, PaymentTransaction, FeeStatus } from '../types';
import { studentService } from './studentService';
import { activityService } from './activityService';

export const getFees = (): FeeRecord[] => {
  return getStorageData<FeeRecord[]>(STORAGE_KEYS.FEES, []);
};

export const getFeeRecords = getFees;

export const getFeeRecordById = (id: string): FeeRecord | undefined => {
  const list = getFees();
  return list.find((f) => f.id === id || f.invoiceNumber === id);
};

export const getFeesByStudent = (studentId: string): FeeRecord[] => {
  return getFees().filter((f) => f.studentId === studentId);
};

export const getFeeRecordByStudentId = (studentId: string): FeeRecord | undefined => {
  return getFees().find((f) => f.studentId === studentId);
};

export const getPayments = (): PaymentTransaction[] => {
  return getStorageData<PaymentTransaction[]>(STORAGE_KEYS.PAYMENTS, []);
};

export const getPaymentsByStudent = (studentId: string): PaymentTransaction[] => {
  return getPayments().filter((p) => p.studentId === studentId);
};

export const getPaymentsByStudentId = getPaymentsByStudent;

export const recordPayment = (data: Partial<PaymentTransaction> & {
  feeRecordId?: string;
  studentId: string;
  studentName: string;
  amount: number;
  paymentMethod: PaymentTransaction['paymentMethod'];
}): PaymentTransaction => {
  const payments = getPayments();
  const count = payments.length + 1;
  const year = new Date().getFullYear();

  const newPayment: PaymentTransaction = {
    id: `pay-${Date.now()}`,
    receiptNumber: `REC-${year}-${String(count).padStart(3, '0')}`,
    paymentDate: data.paymentDate || new Date().toISOString().split('T')[0],
    status: (data.status as any) || 'Successful',
    feeRecordId: data.feeRecordId || '',
    studentId: data.studentId,
    studentName: data.studentName,
    amount: Number(data.amount),
    paymentMethod: data.paymentMethod,
    transactionReference: data.transactionReference || `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
    remarks: data.remarks || 'Tuition receipt verified.',
    ...data,
  };

  const updatedPayments = [newPayment, ...payments];
  setStorageData(STORAGE_KEYS.PAYMENTS, updatedPayments);

  // Update FeeRecord
  const feeRecords = getFees();
  const feeIndex = feeRecords.findIndex(
    (f) => f.id === data.feeRecordId || f.studentId === data.studentId
  );

  if (feeIndex !== -1) {
    const currentFee = feeRecords[feeIndex];
    const newPaid = currentFee.paidAmount + data.amount;
    const newRemaining = Math.max(0, currentFee.totalAmount - newPaid);

    let newStatus: any = 'Pending';
    if (newRemaining === 0) newStatus = 'Paid';
    else if (newPaid > 0) newStatus = 'Partially Paid';

    feeRecords[feeIndex] = {
      ...currentFee,
      paidAmount: newPaid,
      remainingAmount: newRemaining,
      status: newStatus,
      lastPaymentDate: new Date().toISOString().split('T')[0],
    };
    setStorageData(STORAGE_KEYS.FEES, feeRecords);

    // Update Student entity
    studentService.updateStudent(data.studentId, {
      paidFee: newPaid,
      feeStatus: newStatus,
    });
  }

  activityService.log(
    'Tuition Payment Recorded',
    'payments',
    data.studentName,
    `Recorded payment of $${data.amount.toLocaleString()} via ${data.paymentMethod} (${newPayment.receiptNumber}) for ${data.studentName}`
  );

  return newPayment;
};

export const createFeeRecord = (data: Partial<FeeRecord> & {
  studentId: string;
  studentName: string;
  courseName: string;
  feePlan: FeeRecord['feePlan'];
  totalAmount: number;
}): FeeRecord => {
  const list = getFees();
  const count = list.length + 1;
  const year = new Date().getFullYear();

  const paid = data.paidAmount || 0;
  const remaining = Math.max(0, data.totalAmount - paid);
  let status: any = data.status || 'Pending';
  if (remaining === 0) status = 'Paid';
  else if (paid > 0) status = 'Partially Paid';

  const newFee: FeeRecord = {
    id: `fee-${Date.now()}`,
    invoiceNumber: data.invoiceNumber || `INV-${year}-${String(count).padStart(3, '0')}`,
    studentId: data.studentId,
    studentName: data.studentName,
    courseName: data.courseName,
    feePlan: data.feePlan,
    totalAmount: data.totalAmount,
    paidAmount: paid,
    remainingAmount: remaining,
    dueDate: data.dueDate || '2026-11-30',
    status,
    ...data,
  };

  const updated = [newFee, ...list];
  setStorageData(STORAGE_KEYS.FEES, updated);
  return newFee;
};

export const feeService = {
  getFees,
  getFeeRecords,
  getFeeRecordById,
  getFeesByStudent,
  getFeeRecordByStudentId,
  getPayments,
  getPaymentsByStudent,
  getPaymentsByStudentId,
  recordPayment,
  createFeeRecord,
};
