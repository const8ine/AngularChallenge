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

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Reminder,
    private dialogRef: MatDialogRef<ReminderFormComponent>,
    private fb: FormBuilder,
    private calendarService: CalendarService
  ) {
    this.form = this.fb.group({
      noteField: ['', [Validators.required, Validators.maxLength(30)]],
      colorField: ['']
    });
  }

  ngOnInit(): void {
    this.dialogRef.beforeClosed().subscribe(_ => {
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
    if (!this.form.valid) {
      return;
    }

    const reminderText = this.form.get('noteField')?.value;
    const selectedColor = this.form.get('colorField')?.value;
    const reminderTime = new Date();
    const reminderHash = this.hash([reminderText, reminderTime.toString()]);
    const reminder: Reminder = {
      id: reminderHash,
      text: reminderText,
      dateTime: reminderTime,
      color: selectedColor
    };

    console.log(reminder);

    this.calendarService.create(reminder);
    if (callbackFn) {
      callbackFn.call(this);
    }
  }

  public close(): void {
    this.dialogRef.close();
  }
}
