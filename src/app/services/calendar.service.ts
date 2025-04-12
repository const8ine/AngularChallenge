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

  getDays(): Day[] {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const weekday = weekDays;

    const days: Day[] = [];
    const fillInTrailingDays = () => {
      days.push({ id: null, day: null, weekDay: null, reminders: [] });
    };

    // Get the weekday index for the 1st of the month
    const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0 = Sunday

    // Fill in placeholders before the first day
    for (let i = 0; i < firstDayOfWeek; i++) {
      fillInTrailingDays();
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      days.push({
        id: new Date(year, month, day).toISOString().split('T')[0],
        day,
        weekDay: weekday[date.getDay()],
        reminders: [],
      });
    }

    // Fill in placeholders after the last day
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
