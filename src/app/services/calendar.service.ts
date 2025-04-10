import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Reminder } from '../interfaces/reminder';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  reminders: Reminder[] = [];

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
