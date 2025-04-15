import { ActionReducer, INIT, UPDATE } from '@ngrx/store';
import { CalendarState } from './calendar.state';

export function calendarLocalStorageMetaReducer(
  reducer: ActionReducer<CalendarState>
): ActionReducer<CalendarState> {
  return (state, action) => {
    if (action.type === INIT || action.type === UPDATE) {
      const storedState = localStorage.getItem('calendarState');
      if (storedState) {
        try {
          const parsedState = JSON.parse(storedState);
          return parsedState ? parsedState : state;
        } catch (e) {
          console.error('Failed to parse calendar state from localStorage:', e);
        }
      }
    }
    const nextState = reducer(state, action);
    localStorage.setItem('calendarState', JSON.stringify(nextState));
    return nextState;
  };
}

