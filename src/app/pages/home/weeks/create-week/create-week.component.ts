import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Component, Inject, OnInit } from '@angular/core';
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
export class CreateWeekComponent implements OnInit {

  week: FormGroup = this.fb.group({
    week_id: [''],
    week_date: ['', Validators.required]
  });

  title: string = 'NUEVA SEMANA';
  section = true;

  constructor(private fb: FormBuilder,
    private weeksService: WeeksService,
    private spinner: NgxSpinnerService,
    public dialogref: MatDialogRef<CreateWeekComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }


  ngOnInit(): void {
    this.week.patchValue({ week_date: new Date().toISOString().substring(0, 10) });
  }

  updateDate(date: any) {
    const selectedDay = new Date(date.target.value);
    this.week.patchValue({ week_date: selectedDay.toISOString().substring(0, 10) });
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

  close(data?: any) {
    if (data) this.dialogref.close((data));
    else this.dialogref.close();
  }

}
