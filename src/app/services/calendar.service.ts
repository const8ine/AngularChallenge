import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Reminder } from '../interfaces/reminder';
import { Day } from '../interfaces/day';
import { weekDays } from '../components/calendar/constants/week-days';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  reminders: Reminder[] = [];

  getDays(): Day[] {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const weekday = weekDays;

    const days: Day[] = [];
    const fillInTrailingDays = () => {
      days.push({ day: null, weekDay: null });
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
        day,
        weekDay: weekday[date.getDay()]
      });
    }

    // Fill in placeholders after the last day
    while (days.length % 7 !== 0) {
      fillInTrailingDays();
    }

    return days;
  }

  create(data: Reminder): Reminder {
    return data;
  }

  edit(data: Reminder): Reminder {
    return data;
  }

  list(date: Date): Observable<Reminder[]> {
    console.log(date);
    return of(this.reminders);
  }

  delete(reminderId: string): boolean {
    console.log(reminderId);
    return true;
  }
}
