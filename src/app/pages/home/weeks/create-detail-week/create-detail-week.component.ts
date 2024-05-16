import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { DatePipe, UpperCasePipe } from '@angular/common';
import { SelectProductComponent } from './select-product/select-product.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { WeekDetailsService } from '../../../services/week-details.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { AlertService } from '../../../services/alert.service';

@Component({
  selector: 'app-create-detail-week',
  standalone: true,
  imports: [ReactiveFormsModule, MatDividerModule, DatePipe, UpperCasePipe, MatFormFieldModule, MatInputModule, MatIconModule],
  templateUrl: './create-detail-week.component.html'
})
export class CreateDetailWeekComponent implements OnInit, OnDestroy {

  detail: FormGroup = this.fb.group({
    id: [''],
    product_id: ['', Validators.required],
    week_id: ['', Validators.required],
    product_name: ['', Validators.required],
    week_detail_quantity: ['', Validators.required]
  });

  title: string = 'NUEVO DETALLE';
  date: string = new Date(this.data.date).toISOString().substring(0, 10);
  
  section = true;

  constructor(private weekDetailsService: WeekDetailsService,
    private alertService: AlertService,
    private dialogref: MatDialogRef<CreateDetailWeekComponent>,
    private spinner: NgxSpinnerService,
    private dialog: MatDialog,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) private data: any) { }

  ngOnInit(): void {
    if (this.data.section) {
      this.detail.patchValue({ week_id: this.data.week });
    } else {
      this.title = 'MODIFICAR DETALLE';
      this.section = false;
      this.detail.patchValue({ id: this.data.id, product_id: this.data.product_id, week_id: this.data.week, product_name: this.data.product_name, week_detail_quantity: this.data.week_detail_quantity });
    }
  }

  ngOnDestroy(): void {
    this.spinner.hide();
  }

  createUpdateDetail(): void {
    if (this.section) this.createDetail();
    else this.updateDetail();
  }

  createDetail(): void {
    this.spinner.show();
    this.weekDetailsService.createWeekDetail(this.detail.value).subscribe({
      next: result => {
        if (result.status) {
          this.alertService.success(result.alert);
          setTimeout(() => this.close(true), 1000);
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

  updateDetail(): void {
    this.spinner.show();
    this.weekDetailsService.updateWeekDetail(this.detail.value).subscribe({
      next: result => {
        if (result.status) {
          this.alertService.success(result.alert);
          setTimeout(() => this.close(true), 1000);
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

  selectProduct(): void {
    const select = this.dialog.open(SelectProductComponent, {
      height: 'auto', maxHeight: '95vh', width: '40%', minWidth: '350px', data: { products_id: this.data.products_id }
    });
    select.afterClosed().subscribe(response => {
      if (response) {
        this.detail.patchValue({ product_id: response.product_id, product_name: response.product_name });
      }
    });
  }

  close(data?: any): void {
    if (data) this.dialogref.close((data));
    else this.dialogref.close();
  }

}
