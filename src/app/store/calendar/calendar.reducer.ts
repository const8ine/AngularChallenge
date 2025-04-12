import { createReducer, on } from '@ngrx/store';
import { initialState } from './calendar.state';
import * as CalendarActions from './calendar.actions';

export const calendarReducer = createReducer(
  initialState,
  on(CalendarActions.setDays, (state, { days }) => {
    console.log('[Reducer] setDays called with', days);
    return {
      ...state,
      days,
      isLoading: false
    };
  }),
  on(CalendarActions.loadDays, (state) => ({
    ...state,
    isLoading: true
  })),
  on(CalendarActions.addReminder, (state, { reminder }) => {
    const updatedDays = state.days.map(day => {
      if (day.id === reminder.dayId) {
        return {
          ...day,
          reminders: [...(day.reminders ?? []), reminder]
        };
      }
      return day;
    });

    return {
      ...state,
      days: updatedDays
    };
  }),
  on(CalendarActions.updateReminder, (state, { reminder }) => ({
    ...state,
    days: state.days.map(day =>
      day.id === reminder.dayId
        ? {
          ...day,
          reminders: day.reminders.map(r =>
            r.id === reminder.id ? reminder : r
          ),
        }
        : day
    ),
  })),
  on(CalendarActions.deleteReminder, (state, { id }) => ({
    ...state,
    days: state.days.map(day => ({
      ...day,
      reminders: day.reminders.filter(r => r.id !== id),
    })),
  })),
);
