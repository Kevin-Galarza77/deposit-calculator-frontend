import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { WeeksService } from '../../../services/weeks.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-week',
  standalone: true,
  imports: [ReactiveFormsModule, MatDividerModule, MatDividerModule, MatDatepickerModule, ReactiveFormsModule, MatInputModule, MatFormFieldModule, MatNativeDateModule],
  templateUrl: './create-week.component.html',
  styleUrl: './create-week.component.css'
})
export class CreateWeekComponent implements OnInit, OnDestroy {

  week: FormGroup = this.fb.group({
    week_id: [''],
    week_date: ['', Validators.required],
    week_alias: ['', Validators.required]
  });

  title: string = 'NUEVA SEMANA';
  section = true;
  today!: any;

  constructor(private fb: FormBuilder,
    private weeksService: WeeksService,
    private spinner: NgxSpinnerService,
    public dialogref: MatDialogRef<CreateWeekComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.today = new Date();
    if (this.data) {
      this.week.patchValue(this.data);
      this.section = false;
      this.title = 'MODIFICAR SEMANA';
    } else {
      this.week.patchValue({ week_date: this.today.toISOString().substring(0, 10) });
    }
    this.today.setDate(this.today.getDate() - 1);
    this.today = this.today.toISOString().substring(0, 10);
  }

  ngOnDestroy(): void {
    this.spinner.hide();
  }

  updateDate(date: any) {
    this.week.patchValue({ week_date: new Date(date.target.value).toISOString().substring(0, 10) });
  }

  create_update_Week() {
    if (this.section) {
      this.createWeek();
    } else {
      this.updateWeek();
    }
  }

  createWeek() {
    this.spinner.show();
    this.weeksService.createWeek(this.week.value).subscribe({
      next: result => {
        if (result.status) {
          Swal.fire({ icon: "success", title: result.alert, showConfirmButton: false, timer: 1500 });
          setTimeout(() => this.close(result.data), 1000);
        } else {
          let html = '';
          if (result.messages.length !== 0) {
            result.messages.forEach((message: any) => {
              html += `<p> - ${message}</p>`
            });
          }
          Swal.fire({ icon: "error", title: result.alert, html: html, confirmButtonColor: 'red' });
        }
        this.spinner.hide();
      },
      error: e => {
        Swal.fire({ icon: "error", title: 'Se produjo un error contacta al administrador', showConfirmButton: false, timer: 1500 });
        this.spinner.hide();
      }
    });
  }

  updateWeek() {
    this.spinner.show();
    this.weeksService.updateWeek(this.week.value).subscribe({
      next: result => {
        if (result.status) {
          Swal.fire({ icon: "success", title: result.alert, showConfirmButton: false, timer: 1500 });
          setTimeout(() => this.close(result.data), 1000);
        } else {
          let html = '';
          if (result.messages.length !== 0) {
            result.messages.forEach((message: any) => {
              html += `<p> - ${message}</p>`
            });
          }
          Swal.fire({ icon: "error", title: result.alert, html: html, confirmButtonColor: 'red' });
        }
        this.spinner.hide();
      },
      error: e => {
        Swal.fire({ icon: "error", title: 'Se produjo un error contacta al administrador', showConfirmButton: false, timer: 1500 });
        this.spinner.hide();
      }
    });
  }

  close(data?: any) {
    if (data) this.dialogref.close((data));
    else this.dialogref.close();
  }

}
