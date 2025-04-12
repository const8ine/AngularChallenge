import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { calendarReducer } from './calendar.reducer';
import { CalendarEffects } from './calendar.effects';

@NgModule({
  imports: [
    StoreModule.forFeature('calendar', calendarReducer),
    EffectsModule.forFeature([CalendarEffects])
  ],
})
export class CalendarStoreModule {}
