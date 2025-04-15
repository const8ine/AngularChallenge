import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject} from 'rxjs';
import { Reminder } from 'src/app/interfaces/reminder';
import { MatDialog } from '@angular/material/dialog';
import { ReminderFormComponent } from '../reminder-form/reminder-form.component';
import { Day } from '../../interfaces/day';
import { weekDays } from './constants/week-days';
import { Store } from '@ngrx/store';
import { CalendarState } from '../../store/calendar/calendar.state';
import { loadDays } from '../../store/calendar/calendar.actions';
import { selectDays } from '../../store/calendar/calendar.selectors';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit, OnDestroy {
  private onDestroy$ = new Subject<boolean>();
  public month: Day[] = [{id: 'test', day: 1, weekDay: 'monday', reminders: []}];
  public week = weekDays;
  public itemsLimit = 3;

  constructor(
    private store: Store<CalendarState>,
    private matDialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.store.dispatch(loadDays());

    this.store.select(selectDays)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(days => {
        this.month = days;
      });
  }

  ngOnDestroy(): void {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }

  public openReminderForm(reminder?: Reminder): void {
    this.matDialog.open(ReminderFormComponent, {
      data: reminder || null,
    });
  }

  public openReminderFormByDay(dayId: string): void {
    const newReminder: Reminder = {
      id: null,
      text: null,
      timestamp: null,
      dayId,
      time: null,
      color: null
    };
    this.openReminderForm(newReminder);
  }
}
