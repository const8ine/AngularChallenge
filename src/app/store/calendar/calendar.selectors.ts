import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CalendarState } from './calendar.state';

export const selectCalendarState = createFeatureSelector<CalendarState>('calendar');

export const selectDays = createSelector(
  selectCalendarState,
  (state: CalendarState) => state.days
);

export const selectIsLoading = createSelector(
  selectCalendarState,
  (state: CalendarState) => state.isLoading
);

export const selectRemindersByDayId = (dayId: string) => createSelector(
  selectDays,
  (days) => days.find(day => day.id === dayId)?.reminders || []
);
