import { STORAGE_KEYS, DEFAULT_ADMIN_CREDENTIALS } from '../constants/storageKeys';
import { getStorageData, setStorageData, removeStorageData } from '../utils/storage';
import { AdminProfile } from '../types';
import { settingsService } from './settingsService';
import { activityService } from './activityService';

export interface AuthSession {
  isAuthenticated: boolean;
  token: string;
  admin: AdminProfile;
  rememberMe: boolean;
  loginTimestamp: string;
}

export const authService = {
  getCurrentSession(): AuthSession | null {
    return getStorageData<AuthSession | null>(STORAGE_KEYS.ADMIN_AUTH, null);
  },

  getCredentials(): { email: string; password: string } {
    return getStorageData<{ email: string; password: string }>('dudex_custom_admin_creds', {
      email: 'dudexsmartacademy@gmail.com',
      password: DEFAULT_ADMIN_CREDENTIALS.password,
    });
  },

  updateCredentials(email: string, password?: string): void {
    const current = this.getCredentials();
    const updated = {
      email: email.trim(),
      password: password && password.trim() ? password : current.password,
    };
    setStorageData('dudex_custom_admin_creds', updated);
  },

  async login(email: string, pass: string, rememberMe = true): Promise<{ success: boolean; error?: string; session?: AuthSession }> {
    // Artificial latency for realistic async experience
    await new Promise((resolve) => setTimeout(resolve, 400));

    const creds = this.getCredentials();
    const isDefaultMatch =
      email.trim().toLowerCase() === DEFAULT_ADMIN_CREDENTIALS.email.toLowerCase() &&
      pass === DEFAULT_ADMIN_CREDENTIALS.password;
    const isCustomMatch =
      email.trim().toLowerCase() === creds.email.toLowerCase() &&
      pass === creds.password;

    if (isDefaultMatch || isCustomMatch) {
      const admin = settingsService.getAdminProfile();
      const updatedAdmin = { ...admin, email: creds.email || admin.email, lastLogin: new Date().toISOString() };
      settingsService.updateAdminProfile(updatedAdmin);

      const session: AuthSession = {
        isAuthenticated: true,
        token: `dudex_jwt_${Date.now()}_secure_session`,
        admin: updatedAdmin,
        rememberMe,
        loginTimestamp: new Date().toISOString(),
      };

      setStorageData(STORAGE_KEYS.ADMIN_AUTH, session);
      activityService.log('Admin Authenticated', 'auth', admin.name, 'Admin logged into administration console');

      return { success: true, session };
    }

    return {
      success: false,
      error: `Invalid credentials. Please use ${creds.email} / ${creds.password === DEFAULT_ADMIN_CREDENTIALS.password ? 'AdminPassword123!' : 'your updated password'}`,
    };
  },

  logout(): void {
    const session = this.getCurrentSession();
    if (session) {
      activityService.log('Admin Logged Out', 'auth', session.admin.name, 'Admin closed session');
    }
    removeStorageData(STORAGE_KEYS.ADMIN_AUTH);
  },

  isAuthenticated(): boolean {
    const session = this.getCurrentSession();
    return !!session?.isAuthenticated;
  },

  async requestPasswordReset(email: string): Promise<{ success: boolean; message: string }> {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return {
      success: true,
      message: `Password reset instructions have been simulated for ${email}. (Frontend simulation mode)`,
    };
  },
};
