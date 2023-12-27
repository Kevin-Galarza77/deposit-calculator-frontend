import { DatePipe, TitleCasePipe } from '@angular/common';
import { Component, Inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SelectProductComponent } from './select-product/select-product.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { WeekDetailsService } from '../../../services/week-details.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-detail-week',
  standalone: true,
  imports: [ReactiveFormsModule, MatDividerModule, DatePipe, TitleCasePipe, MatFormFieldModule, MatInputModule],
  templateUrl: './create-detail-week.component.html',
  styleUrl: './create-detail-week.component.css'
})
export class CreateDetailWeekComponent implements OnDestroy {

  detail: FormGroup = this.fb.group({
    id: [''],
    product_id: ['', Validators.required],
    week_id: ['', Validators.required],
    product_name: ['', Validators.required],
    week_detail_quantity: ['', Validators.required]
  });

  title: string = 'Nuevo Detalle ';
  date: Date = new Date(this.data.date);
  section = true;

  constructor(private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private weekDetailsService: WeekDetailsService,
    public dialogref: MatDialogRef<CreateDetailWeekComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog) {
    if (!data.section) {
      this.title = 'Editar Detalle';
      this.section = false;
      this.detail.patchValue({ id: data.id, product_id: data.product_id, week_id: data.week, product_name: data.product_name, week_detail_quantity: data.week_detail_quantity });
    } else {
      this.detail.patchValue({ week_id: data.week })
    }
  }

  ngOnDestroy(): void {
    this.spinner.hide();
  }

  create_update_Detail() {
    if (this.section) {
      this.createDetail();
    } else {
      this.updateDetail();
    }
  }

  createDetail() {
    this.spinner.show();
    this.weekDetailsService.createWeekDetail(this.detail.value).subscribe({
      next: result => {
        if (result.status) {
          Swal.fire({ icon: "success", title: result.alert, showConfirmButton: false, timer: 1500 });
          setTimeout(() => this.close(true), 1000);
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

  updateDetail() {
    this.spinner.show();
    this.weekDetailsService.updateWeekDetail(this.detail.value).subscribe({
      next: result => {
        if (result.status) {
          Swal.fire({ icon: "success", title: result.alert, showConfirmButton: false, timer: 1500 });
          setTimeout(() => this.close(true), 1000);
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

  selectProduct() {
    const select = this.dialog.open(SelectProductComponent, {
      height: 'auto',
      maxHeight: '95vh',
      width: 'auto',
      minWidth: '350px',
      data: { product: this.detail.value.product_id, products_id: this.data.products_id }
    });
    select.afterClosed().subscribe(response => {
      if (response) {
        this.detail.patchValue({ product_id: response.product_id, product_name: response.product_name });
      }
    });
  }

}
