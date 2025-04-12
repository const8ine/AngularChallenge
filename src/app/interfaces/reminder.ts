import { reminderColors } from '../components/calendar/constants/reminder-colors';

export interface Reminder {
  id: string;
  text: string;
  timestamp: Date;
  dayId: string;
  time: string;
  color: keyof typeof reminderColors;
  city?: string;
}

