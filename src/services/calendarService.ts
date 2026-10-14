import { CalendarEvent } from '../types';
import { STORAGE_KEYS } from '../constants/storageKeys';
import { getStorageData, setStorageData } from '../utils/storage';
import { initialCalendarEvents } from '../data/mockData';
import { logActivity } from './activityService';

export function getCalendarEvents(): CalendarEvent[] {
  return getStorageData<CalendarEvent[]>(
    STORAGE_KEYS.CALENDAR_EVENTS,
    initialCalendarEvents as unknown as CalendarEvent[]
  );
}

export function createCalendarEvent(data: Omit<CalendarEvent, 'id'>): CalendarEvent {
  const events = getCalendarEvents();
  const newEvent: CalendarEvent = {
    ...data,
    id: `cal-${Date.now()}`,
  };
  const updated = [newEvent, ...events];
  setStorageData(STORAGE_KEYS.CALENDAR_EVENTS, updated);
  logActivity({
    actor: 'Dr. Alexander Vance',
    role: 'Super Admin',
    module: 'calendar',
    action: 'CREATE',
    entity: 'Calendar Event',
    description: `Added calendar event: ${newEvent.title} (${newEvent.type})`,
  });
  return newEvent;
}

export function updateCalendarEvent(id: string, updates: Partial<CalendarEvent>): CalendarEvent | null {
  const events = getCalendarEvents();
  const index = events.findIndex((e) => e.id === id);
  if (index === -1) return null;
  const updatedEvent = { ...events[index], ...updates };
  events[index] = updatedEvent;
  setStorageData(STORAGE_KEYS.CALENDAR_EVENTS, events);
  logActivity({
    actor: 'Dr. Alexander Vance',
    role: 'Super Admin',
    module: 'calendar',
    action: 'UPDATE',
    entity: 'Calendar Event',
    description: `Updated calendar event: ${updatedEvent.title}`,
  });
  return updatedEvent;
}

export function deleteCalendarEvent(id: string): boolean {
  const events = getCalendarEvents();
  const event = events.find((e) => e.id === id);
  const filtered = events.filter((e) => e.id !== id);
  if (filtered.length === events.length) return false;
  setStorageData(STORAGE_KEYS.CALENDAR_EVENTS, filtered);
  logActivity({
    actor: 'Dr. Alexander Vance',
    role: 'Super Admin',
    module: 'calendar',
    action: 'DELETE',
    entity: 'Calendar Event',
    description: `Deleted calendar event: ${event?.title || id}`,
  });
  return true;
}

export const calendarService = {
  getCalendarEvents,
  createCalendarEvent,
  updateCalendarEvent,
  deleteCalendarEvent,
};
