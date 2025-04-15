import { NgModule } from '@angular/core';
import { MetaReducer, StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { calendarReducer } from './calendar.reducer';
import { CalendarEffects } from './calendar.effects';
import { calendarLocalStorageMetaReducer } from './calendar.metareducer';
import { CalendarState } from './calendar.state';

const metaReducers: MetaReducer<CalendarState>[] = [calendarLocalStorageMetaReducer];

@NgModule({
  imports: [
    StoreModule.forFeature('calendar', calendarReducer, { metaReducers }),
    EffectsModule.forFeature([CalendarEffects])
  ],
})
export class CalendarStoreModule {}
