import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Reminder } from 'src/app/interfaces/reminder';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CalendarService } from '../../services/calendar.service';
import { reminderColors } from '../calendar/constants/reminder-colors';

@Component({
  selector: 'app-reminder-form',
  templateUrl: './reminder-form.component.html',
  styleUrls: ['./reminder-form.component.scss']
})
export class ReminderFormComponent implements OnInit {
  public form: FormGroup;
  public colorKeys = reminderColors;
  public isExistent = false;
  public days: { id: string; label: string }[] = [];
  private hasSaved = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Reminder,
    private dialogRef: MatDialogRef<ReminderFormComponent>,
    private fb: FormBuilder,
    private calendarService: CalendarService,
  ) {
    this.form = this.fb.group({
      noteField: ['', [Validators.required, Validators.maxLength(30)]],
      cityField: [''],
      colorField: [''],
      dayField: ['', Validators.required],
      timeField: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.days = this.calendarService.getDays()
      .filter(day => day.id !== null)
      .map(day => ({
        id: day.id,
        label: `${day.day} — ${day.weekDay}`
      }));

    this.isExistent = !!this.data?.id;

    if (this.data) {
      this.form.patchValue({
        noteField: this.data.text ?? '',
        colorField: this.data.color ?? '',
        dayField: this.data.dayId ?? '',
        timeField: this.data.time ?? ''
      });
    }

    this.dialogRef.beforeClosed().subscribe(() => {
      this.saveForm();
    });
  }

  private hash(strings: string[]): string {
    const input = strings.join('');
    let total = 0;
    for (let i = 0; i < input.length; i++) {
      total += input.charCodeAt(i);
    }
    return total.toString(36);
  }

  public saveForm(callbackFn?: () => void): void {
    if (this.hasSaved || !this.form.valid) {
      return;
    }

    this.hasSaved = true;

    const reminderText = this.form.get('noteField')?.value;
    const selectedColor = this.form.get('colorField')?.value;
    const selectedDay = this.data?.dayId ?? this.form.get('dayField')?.value; // e.g. "2025-04-04"
    const selectedTime = this.form.get('timeField')?.value; // e.g. "14:30"
    const reminderTimestamp = new Date();
    const reminderHash = this.hash([reminderText, reminderTimestamp.toString()]);

    const reminder: Reminder = {
      id: reminderHash,
      dayId: selectedDay,
      time: selectedTime,
      text: reminderText,
      timestamp: reminderTimestamp,
      color: selectedColor
    };

    if (this.isExistent) {
      this.calendarService.edit(reminder);
    } else {
      this.calendarService.create(reminder);
    }

    if (callbackFn) {
      callbackFn.call(this);
    }
  }

  public closeAction(): void {
    this.dialogRef.close();
  }

  public saveAction(): void {
    this.saveForm(() => this.closeAction());
  }

  public deleteAction(): void {
    this.calendarService.delete(this.data.id);
    this.closeAction();
  }
}
