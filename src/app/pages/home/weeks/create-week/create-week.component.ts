import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { WeeksService } from '../../../services/weeks.service';
import { AlertService } from '../../../services/alert.service'; 

@Component({
  selector: 'app-create-week',
  standalone: true,
  imports: [ReactiveFormsModule, MatIconModule, MatDividerModule, MatDividerModule, MatDatepickerModule, ReactiveFormsModule, MatInputModule, MatFormFieldModule, MatNativeDateModule],
  templateUrl: './create-week.component.html' 
})
export class CreateWeekComponent implements OnInit, OnDestroy {

  week: FormGroup = this.fb.group({
    week_id: [''],
    week_date: ['', Validators.required],
    week_alias: ['', Validators.required]
  });

  title: string = 'NUEVA SEMANA';
  section = true;
  today!: string;

  constructor(private weeksService: WeeksService,
    private alertService: AlertService,
    public dialogref: MatDialogRef<CreateWeekComponent>,
    private spinner: NgxSpinnerService,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    const today = new Date();
    if (this.data) {
      this.week.patchValue(this.data);
      this.section = false;
      this.title = 'MODIFICAR SEMANA';
    } else {
      this.week.patchValue({ week_date: today.toISOString().substring(0, 10) });
      today.setDate(today.getDate() - 1);
      this.today = today.toISOString().substring(0, 10);
    }
  }

  ngOnDestroy(): void {
    this.spinner.hide();
  }

  updateDate(date: any): void {
    this.week.patchValue({ week_date: new Date(date.target.value).toISOString().substring(0, 10) });
  }

  createUpdateWeek(): void {
    if (this.section) this.createWeek();
    else this.updateWeek();
  }

  createWeek(): void {
    this.spinner.show();
    this.weeksService.createWeek(this.week.value).subscribe({
      next: result => {
        if (result.status) {
          this.alertService.success(result.alert);
          setTimeout(() => this.close(result.data), 1000);
        } else {
          this.alertService.error(result.alert, result.messages);
        }
        this.spinner.hide();
      },
      error: e => {
        this.alertService.errorApplication();
        this.spinner.hide();
      }
    });
  }

  updateWeek(): void {
    this.spinner.show();
    this.weeksService.updateWeek(this.week.value).subscribe({
      next: result => {
        if (result.status) {
          this.alertService.success(result.alert);
          setTimeout(() => this.close(result.data), 1000);
        } else {
          this.alertService.error(result.alert, result.messages);
        }
        this.spinner.hide();
      },
      error: e => {
        this.alertService.errorApplication();
        this.spinner.hide();
      }
    });
  }

  close(data?: any): void {
    if (data) this.dialogref.close((data));
    else this.dialogref.close();
  }

}
