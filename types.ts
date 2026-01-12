export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';

export const DAYS: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export interface Person {
  id: string;
  name: string;
  description?: string;
  created_at?: string;
}

export interface TimetableSlot {
  id: string;
  person_id: string;
  day_of_week: DayOfWeek;
  start_time: string; // Format: "HH:mm"
  end_time: string;   // Format: "HH:mm"
  subject: string;
  teacher: string;
  created_at?: string;
}

// Helper to format time strings (e.g. 14:00:00 -> 2:00 PM)
export const formatTime = (timeStr: string): string => {
  if (!timeStr) return '';
  const [hours, minutes] = timeStr.split(':');
  const date = new Date();
  date.setHours(parseInt(hours, 10));
  date.setMinutes(parseInt(minutes, 10));
  return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
};

// Helper for sorting slots
export const getMinutesFromTime = (timeStr: string): number => {
    if (!timeStr) return 0;
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
};
