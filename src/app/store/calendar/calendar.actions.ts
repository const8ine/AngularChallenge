import { createAction, props } from '@ngrx/store';
import { Day } from '../../interfaces/day';
import { Reminder } from '../../interfaces/reminder';

export const loadDays = createAction('[Calendar] Load Days');

export const setDays = createAction('[Calendar] Set Days', props<{ days: Day[] }>());

export const addReminder = createAction(
  '[Calendar] Add Reminder',
  props<{ reminder: Reminder }>()
);

export const updateReminder = createAction(
  '[Calendar] Update Reminder',
  props<{ reminder: Reminder }>()
);

export const deleteReminder = createAction(
  '[Calendar] Delete Reminder',
  props<{ id: string }>()
);
