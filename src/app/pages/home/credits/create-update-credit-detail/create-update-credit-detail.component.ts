import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { DatePipe, UpperCasePipe } from '@angular/common';
import { SelectPersonComponent } from './select-person/select-person.component';
import { CreditDetailService } from '../../../services/credit-detail.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { AlertService } from '../../../services/alert.service';

@Component({
  selector: 'app-create-update-credit-detail',
  standalone: true,
  imports: [ReactiveFormsModule, MatDividerModule, DatePipe, MatIconModule, UpperCasePipe, MatFormFieldModule, MatInputModule, MatSelectModule],
  templateUrl: './create-update-credit-detail.component.html' 
})
export class CreateUpdateCreditDetailComponent implements OnInit, OnDestroy {

  detail: FormGroup = this.fb.group({
    id: [''],
    week_id: ['', Validators.required],
    credit_people_id: ['', Validators.required],
    credit_people_name: ['', Validators.required],
    credit_detail_description: ['', Validators.required],
    credit_detail_value: ['', Validators.required],
    credit_detail_status: [1]
  });

  title: string = 'NUEVO CRÉDITO';
  date: string = new Date(this.data.date).toISOString().substring(0, 10);

  section = true;

  constructor(private creditDetailService: CreditDetailService,
    private alertService: AlertService,
    private dialogref: MatDialogRef<CreateUpdateCreditDetailComponent>,
    private spinner: NgxSpinnerService,
    private dialog: MatDialog,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    if (this.data.section) {
      this.detail.patchValue({ week_id: this.data.week })
    } else {
      this.title = 'MODIFICAR CRÉDITO';
      this.section = false;
      this.detail.patchValue(this.data);
    }
  }

  ngOnDestroy(): void {
    this.spinner.hide();
  }

  create_update_CreditDetail() {
    if (this.section) this.createCreditDetail();
    else this.updateDetail();
  }

  createCreditDetail() {
    this.spinner.show();
    this.creditDetailService.createCreditDetail(this.detail.value).subscribe({
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

  updateDetail() {
    this.spinner.show();
    this.creditDetailService.updateCreditDetail(this.detail.value).subscribe({
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

  selectEntity() {
    const select = this.dialog.open(SelectPersonComponent, {
      height: 'auto', maxHeight: '75vh', width: '35%', minWidth: '350px', data: { people_ids: this.data.people_ids }
    });
    select.afterClosed().subscribe(
      response => {
        if (response) this.detail.patchValue({ credit_people_id: response.credit_people_id, credit_people_name: response.credit_people_name });
      });
  }

  close(data?: any) {
    if (data) this.dialogref.close((data));
    else this.dialogref.close();
  }

}
