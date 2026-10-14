import { STORAGE_KEYS } from '../constants/storageKeys';
import { getStorageData, setStorageData } from '../utils/storage';
import { ActivityLog } from '../types';

export const getActivityLogs = (): ActivityLog[] => {
  return getStorageData<ActivityLog[]>(STORAGE_KEYS.ACTIVITY_LOGS, []);
};

export const logActivity = (params: {
  action: string;
  module?: string;
  user?: string;
  actor?: string;
  entity?: string;
  details?: string;
  description?: string;
  timestamp?: string;
  status?: string;
  role?: string;
}): ActivityLog => {
  const logs = getActivityLogs();
  const newLog: ActivityLog = {
    id: `act-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp: params.timestamp || new Date().toISOString(),
    adminName: params.actor || params.user || 'Dr. Alexander Vance',
    action: params.action,
    module: (params.module as any) || 'system',
    entity: params.entity || params.action,
    description: params.details || params.description || params.action,
    ipAddress: '192.168.1.104',
  };
  const updated = [newLog, ...logs];
  setStorageData(STORAGE_KEYS.ACTIVITY_LOGS, updated);
  return newLog;
};

export const activityService = {
  getLogs: getActivityLogs,
  log(
    action: string,
    module: ActivityLog['module'],
    entity: string,
    description: string,
    adminName = 'Dr. Alexander Vance'
  ): ActivityLog {
    return logActivity({
      action,
      module,
      user: adminName,
      details: description,
    });
  },
  clearLogs(): void {
    setStorageData(STORAGE_KEYS.ACTIVITY_LOGS, []);
  },
};
