import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarRoutingModule } from './calendar-routing.module';
import { CalendarComponent } from './calendar.component';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { ReminderFormComponent } from '../reminder-form/reminder-form.component';
import { ReminderFormModule } from '../reminder-form/reminder-form.module';
import { HttpClientModule } from '@angular/common/http';
import { CalendarStoreModule } from '../../store/calendar/store.module';

@NgModule({
  declarations: [CalendarComponent],
  exports: [CalendarComponent],
  imports: [
    HttpClientModule,
    CommonModule,
    SharedModule,
    ReminderFormModule,
    CalendarRoutingModule,
    CalendarStoreModule,
  ],
  entryComponents: [ReminderFormComponent],
})
export class CalendarModule { }
