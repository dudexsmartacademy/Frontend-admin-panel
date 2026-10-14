import { STORAGE_KEYS } from '../constants/storageKeys';
import { getStorageData, setStorageData } from '../utils/storage';
import { SystemSettings, AdminProfile } from '../types';
import { initialSettings, initialAdminProfile } from '../data/mockData';
import { activityService } from './activityService';

export const settingsService = {
  getSettings(): SystemSettings {
    return getStorageData<SystemSettings>(STORAGE_KEYS.SETTINGS, initialSettings);
  },

  updateSettings(partial: Partial<SystemSettings>): SystemSettings {
    const current = this.getSettings();
    const updated = { ...current, ...partial };
    setStorageData(STORAGE_KEYS.SETTINGS, updated);
    activityService.log('System Settings Updated', 'settings', 'Platform Configuration', 'Updated academy platform configuration');
    return updated;
  },

  getAdminProfile(): AdminProfile {
    return getStorageData<AdminProfile>(STORAGE_KEYS.ADMIN_PROFILE, initialAdminProfile);
  },

  updateAdminProfile(partial: Partial<AdminProfile>): AdminProfile {
    const current = this.getAdminProfile();
    const updated = { ...current, ...partial };
    setStorageData(STORAGE_KEYS.ADMIN_PROFILE, updated);
    activityService.log('Admin Profile Updated', 'settings', current.name, 'Updated administrator contact and identity information');
    return updated;
  },
};
