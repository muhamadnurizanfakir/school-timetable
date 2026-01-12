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

// Color Palette for Subjects
const colors = [
  { bg: 'bg-red-100', text: 'text-red-900', border: 'border-red-200', label: 'bg-red-200' },
  { bg: 'bg-orange-100', text: 'text-orange-900', border: 'border-orange-200', label: 'bg-orange-200' },
  { bg: 'bg-amber-100', text: 'text-amber-900', border: 'border-amber-200', label: 'bg-amber-200' },
  { bg: 'bg-green-100', text: 'text-green-900', border: 'border-green-200', label: 'bg-green-200' },
  { bg: 'bg-emerald-100', text: 'text-emerald-900', border: 'border-emerald-200', label: 'bg-emerald-200' },
  { bg: 'bg-teal-100', text: 'text-teal-900', border: 'border-teal-200', label: 'bg-teal-200' },
  { bg: 'bg-cyan-100', text: 'text-cyan-900', border: 'border-cyan-200', label: 'bg-cyan-200' },
  { bg: 'bg-sky-100', text: 'text-sky-900', border: 'border-sky-200', label: 'bg-sky-200' },
  { bg: 'bg-blue-100', text: 'text-blue-900', border: 'border-blue-200', label: 'bg-blue-200' },
  { bg: 'bg-indigo-100', text: 'text-indigo-900', border: 'border-indigo-200', label: 'bg-indigo-200' },
  { bg: 'bg-violet-100', text: 'text-violet-900', border: 'border-violet-200', label: 'bg-violet-200' },
  { bg: 'bg-purple-100', text: 'text-purple-900', border: 'border-purple-200', label: 'bg-purple-200' },
  { bg: 'bg-fuchsia-100', text: 'text-fuchsia-900', border: 'border-fuchsia-200', label: 'bg-fuchsia-200' },
  { bg: 'bg-pink-100', text: 'text-pink-900', border: 'border-pink-200', label: 'bg-pink-200' },
  { bg: 'bg-rose-100', text: 'text-rose-900', border: 'border-rose-200', label: 'bg-rose-200' },
];

export const getSubjectColor = (subject: string) => {
  if (!subject) return colors[0];
  let hash = 0;
  // Simple hash function to consistently map a string to an index
  for (let i = 0; i < subject.length; i++) {
    hash = subject.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % colors.length;
  return colors[index];
};
