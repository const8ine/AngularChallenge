import { Day } from '../../interfaces/day';

export interface CalendarState {
  days: Day[];
  isLoading: boolean;
}

export const initialState: CalendarState = {
  days: [],
  isLoading: false,
};
