import { Reminder } from './reminder';
import { WeatherForecast } from './wearher-forecast';

export type Day = {
  id: string;
  day: number;
  weekDay: string;
  reminders: Reminder[];
  weatherForecast?: WeatherForecast;
};
