import { reminderColors } from '../components/calendar/constants/reminder-colors';
import { WeatherForecast } from './wearher-forecast';

export interface Reminder {
  id: string;
  text: string;
  timestamp: Date;
  dayId: string;
  time: string;
  color: keyof typeof reminderColors;
  city: string;
  weatherForecast: WeatherForecast | null;
}

