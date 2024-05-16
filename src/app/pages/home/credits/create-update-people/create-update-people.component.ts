import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { CreditPeopleService } from '../../../services/credit-people.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { AlertService } from '../../../services/alert.service';

@Component({
  selector: 'app-create-update-people',
  standalone: true,
  imports: [ReactiveFormsModule, MatDividerModule, MatInputModule, MatIconModule, MatFormFieldModule],
  templateUrl: './create-update-people.component.html'
})
export class CreateUpdatePeopleComponent implements OnInit, OnDestroy {

  person: FormGroup = this.fb.group({
    credit_people_id: [''],
    credit_people_name: ['', Validators.required]
  });

  title: string = 'NUEVA PERSONA';
  section: boolean = true;

  constructor(private creditPeopleService: CreditPeopleService,
    private alertService: AlertService,
    private spinner: NgxSpinnerService,
    private dialogref: MatDialogRef<CreateUpdatePeopleComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) private data: any) { }

  ngOnInit(): void {
    if (this.data) {
      this.section = false;
      this.title = 'MODIFICAR PERSONA';
      this.person.patchValue(this.data);
    }
  }

  ngOnDestroy(): void {
    this.spinner.hide();
  }

  create_update_Person() {
    if (this.section) this.createPerson();
    else this.updatePerson();
  }

  createPerson() {
    this.spinner.show();
    this.creditPeopleService.createPerson(this.person.value).subscribe({
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

  updatePerson() {
    this.spinner.show();
    this.creditPeopleService.updatePerson(this.person.value).subscribe({
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
        this.alertService.errorApplication(); this.spinner.hide();
      }
    });
  }

  close(data?: any) {
    if (data) this.dialogref.close((data));
    else this.dialogref.close();
  }

}
