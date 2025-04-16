import { Reminder } from './reminder';

export type Day = {
  id: string;
  day: number;
  weekDay: string;
  reminders: Reminder[];
};
