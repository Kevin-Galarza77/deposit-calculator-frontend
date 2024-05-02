import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject, OnDestroy } from '@angular/core';
import { CreditPeopleService } from '../../../services/credit-people.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import Swal from 'sweetalert2';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-create-update-people',
  standalone: true,
  imports: [ReactiveFormsModule, MatDividerModule, MatInputModule, MatIconModule, MatFormFieldModule],
  templateUrl: './create-update-people.component.html',
  styleUrl: './create-update-people.component.css'
})
export class CreateUpdatePeopleComponent implements OnDestroy {

  person: FormGroup = this.fb.group({
    credit_people_id: [''],
    credit_people_name: ['', Validators.required]
  });

  title: string = 'NUEVA PERSONA';
  section: boolean = true;

  constructor(private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private creditPeopleService: CreditPeopleService,
    public dialogref: MatDialogRef<CreateUpdatePeopleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    if (data) {
      this.title = 'MODIFICAR PERSONA';
      this.person.patchValue(data);
      this.section = false;
    }
  }

  ngOnDestroy(): void {
    this.spinner.hide();
  }

  create_update_Person() {
    if (this.section) {
      this.createPerson();
    } else {
      this.updatePerson();
    }
  }

  createPerson() {
    this.spinner.show();
    this.creditPeopleService.createPerson(this.person.value).subscribe({
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

  updatePerson() {
    this.spinner.show();
    this.creditPeopleService.updatePerson(this.person.value).subscribe({
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
