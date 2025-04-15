import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError, withLatestFrom } from 'rxjs/operators';
import * as CalendarActions from './calendar.actions';
import { CalendarService } from '../../services/calendar.service';
import { WeatherService } from '../../services/weather.service';
import { selectDays } from './calendar.selectors';
import { Store } from '@ngrx/store';
import { CalendarState } from './calendar.state';
import { WeatherForecast } from '../../interfaces/wearher-forecast';
import { Day } from '../../interfaces/day';

@Injectable()
export class CalendarEffects {
  constructor(
    private actions$: Actions,
    private calendarService: CalendarService,
    private weatherService: WeatherService,
    private store: Store<CalendarState>
  ) {
  }

  loadDays$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CalendarActions.loadDays),
      withLatestFrom(this.store.select(selectDays)),
      mergeMap(([_, existingDays]) => {
        const days = this.calendarService.getDays(existingDays);
        return of(CalendarActions.setDays({ days }));
      }),
      catchError(() => of(CalendarActions.setDays({ days: [] })))
    )
  );

  addWeatherForecast$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CalendarActions.setDays),
      withLatestFrom(this.store.select(selectDays)),
      mergeMap(([_, days]) =>
        this.weatherService.getWeatherInformation('Buenos Aires').pipe(
          map((weatherForecast: WeatherForecast) => {
            const daysWithWeatherData: Day[] = days.map(day => ({
              ...day,
              weatherForecast: day.id
                ? {
                  temperature: weatherForecast.temperature,
                  condition: weatherForecast.condition,
                  iconUrl: weatherForecast.iconUrl,
                }
                : null,
            }));
            return CalendarActions.setDays({ days: daysWithWeatherData });
          }),
          catchError(() => of({ type: '[Calendar] Failed to add weather forecast' }))
        )
      )
    )
  );
}
