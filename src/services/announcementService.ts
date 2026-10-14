import { Announcement, CentralNotification } from '../types';
import { STORAGE_KEYS } from '../constants/storageKeys';
import { getStorageData, setStorageData } from '../utils/storage';
import { initialAnnouncements, initialCentralNotifications } from '../data/mockData';
import { logActivity } from './activityService';

export function getAnnouncements(): Announcement[] {
  return getStorageData<Announcement[]>(
    STORAGE_KEYS.ANNOUNCEMENTS,
    initialAnnouncements as unknown as Announcement[]
  );
}

export function getAnnouncementById(id: string): Announcement | undefined {
  const list = getAnnouncements();
  return list.find((a) => a.id === id);
}

export function createAnnouncement(data: Omit<Announcement, 'id' | 'viewsCount'>): Announcement {
  const list = getAnnouncements();
  const newAnn: Announcement = {
    ...data,
    id: `ann-${Date.now()}`,
    viewsCount: 0,
  };
  const updated = [newAnn, ...list];
  setStorageData(STORAGE_KEYS.ANNOUNCEMENTS, updated);

  // Trigger simulated notification delivery to matching audience
  try {
    const notifs = getStorageData<CentralNotification[]>(
      STORAGE_KEYS.CENTRAL_NOTIFICATIONS,
      initialCentralNotifications as unknown as CentralNotification[]
    );
    const newNotif: CentralNotification = {
      id: `cnt-${Date.now()}`,
      title: `Notice: ${newAnn.title}`,
      message: newAnn.content.length > 120 ? `${newAnn.content.slice(0, 117)}...` : newAnn.content,
      type: (newAnn.priority === 'High' ? 'warning' : 'info') as any,
      priority: newAnn.priority,
      audience: newAnn.audience as any,
      courseName: newAnn.courseName,
      batchName: newAnn.batchName,
      status: 'Sent',
      createdAt: new Date().toISOString(),
      recipientsCount: newAnn.audience === 'Teachers Only' ? 6 : newAnn.audience === 'Students Only' ? 280 : 286,
      readCount: 0,
      unreadCount: newAnn.audience === 'Teachers Only' ? 6 : newAnn.audience === 'Students Only' ? 280 : 286,
      read: false,
      actionUrl: '/admin/announcements',
    };
    setStorageData(STORAGE_KEYS.CENTRAL_NOTIFICATIONS, [newNotif, ...notifs]);
  } catch (err) {
    console.error('Error dispatching notification for announcement:', err);
  }

  logActivity({
    actor: data.author || 'Dr. Alexander Vance',
    role: 'Super Admin',
    module: 'announcements',
    action: 'CREATE',
    entity: 'Announcement',
    description: `Published announcement "${newAnn.title}" to target audience [${newAnn.audience}]`,
  });

  return newAnn;
}

export function updateAnnouncement(id: string, updates: Partial<Announcement>): Announcement | null {
  const list = getAnnouncements();
  const index = list.findIndex((a) => a.id === id);
  if (index === -1) return null;
  const updatedAnn = { ...list[index], ...updates };
  list[index] = updatedAnn;
  setStorageData(STORAGE_KEYS.ANNOUNCEMENTS, list);
  logActivity({
    actor: 'Dr. Alexander Vance',
    role: 'Super Admin',
    module: 'announcements',
    action: 'UPDATE',
    entity: 'Announcement',
    description: `Updated announcement: "${updatedAnn.title}"`,
  });
  return updatedAnn;
}

export function deleteAnnouncement(id: string): boolean {
  const list = getAnnouncements();
  const ann = list.find((a) => a.id === id);
  const filtered = list.filter((a) => a.id !== id);
  if (filtered.length === list.length) return false;
  setStorageData(STORAGE_KEYS.ANNOUNCEMENTS, filtered);
  logActivity({
    actor: 'Dr. Alexander Vance',
    role: 'Super Admin',
    module: 'announcements',
    action: 'DELETE',
    entity: 'Announcement',
    description: `Deleted announcement: "${ann?.title || id}"`,
  });
  return true;
}

export const announcementService = {
  getAnnouncements,
  getAnnouncementById,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
};
