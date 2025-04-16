import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Reminder } from '../interfaces/reminder';
import { Day } from '../interfaces/day';
import { weekDays } from '../components/calendar/constants/week-days';
import { selectRemindersByDayId } from '../store/calendar/calendar.selectors';
import { Store } from '@ngrx/store';
import { CalendarState } from '../store/calendar/calendar.state';
import {addReminder, deleteReminder, updateReminder} from '../store/calendar/calendar.actions';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  constructor(private store: Store<CalendarState>) {
  }

  getDays(existingDays: Day[] = []): Day[] {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const weekday = weekDays;

    const existingDayMap = new Map(existingDays.map(day => [day.id, day]));
    const existingRemindersMap = new Map<string, Reminder>();

    for (const day of existingDays) {
      for (const reminder of day.reminders) {
        if (!reminder?.id) {
          continue;
        }
        const existing = existingRemindersMap.get(reminder.id);
        if (!existing || (reminder.timestamp && reminder.timestamp > existing.timestamp)) {
          existingRemindersMap.set(reminder.id, reminder);
        }
      }
    }

    const days: Day[] = [];

    const fillInTrailingDays = () => {
      days.push({ id: null, day: null, weekDay: null, reminders: [] });
    };

    const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0 = Sunday

    for (let i = 0; i < firstDayOfWeek; i++) {
      fillInTrailingDays();
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const id = date.toISOString().split('T')[0];
      const existingDay = existingDayMap.get(id);

      const mergedReminders = existingDay?.reminders.map(r => {
        const updated = existingRemindersMap.get(r.id);
        return updated || r;
      }) ?? [];

      days.push({
        id,
        day,
        weekDay: weekday[date.getDay()],
        reminders: mergedReminders,
      });
    }

    while (days.length % 7 !== 0) {
      fillInTrailingDays();
    }

    return days;
  }

  create(data: Reminder): void {
    this.store.dispatch(addReminder({ reminder: data }));
  }

  edit(data: Reminder): void {
    this.store.dispatch(updateReminder({ reminder: data }));
  }

  delete(reminderId: string): void {
    this.store.dispatch(deleteReminder({ id: reminderId }));
  }

  list(dayId: string): Observable<Reminder[]> {
    return this.store.select(selectRemindersByDayId(dayId));
  }
}
