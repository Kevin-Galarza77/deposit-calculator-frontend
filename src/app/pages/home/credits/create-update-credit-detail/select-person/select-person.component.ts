import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CreditPeopleService } from '../../../../services/credit-people.service';
import { MatDividerModule } from '@angular/material/divider';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { AlertService } from '../../../../services/alert.service';
@Component({
  selector: 'app-select-person',
  standalone: true,
  imports: [MatDividerModule],
  templateUrl: './select-person.component.html',
  styleUrl: './select-person.component.css'
})
export class SelectPersonComponent implements OnInit, OnDestroy {

  persons_filter: any[] = [];
  people: any[] = [];

  allPersons!: Subscription;

  constructor(private creditPeopleService: CreditPeopleService,
    private alertService: AlertService,
    private dialogref: MatDialogRef<SelectPersonComponent>,
    private spinner: NgxSpinnerService,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.getAllOnlyPeople();
  }

  ngOnDestroy(): void {
    this.allPersons?.unsubscribe();
    this.spinner.hide();
  }

  getAllOnlyPeople() {
    this.spinner.show();
    this.allPersons = this.creditPeopleService.getAllOnlyPeople().subscribe({
      next: result => {
        if (result.status) {
          this.people = result.data;
          this.persons_filter = result.data;
        }
        this.spinner.hide();
      },
      error: e => this.spinner.hide()
    });
  }

  filterPerson(input: any) {
    this.people = this.persons_filter.filter(person => person.credit_people_name.toLowerCase().includes(String(input.target.value).toLowerCase()));
  }

  close(data?: any) {
    if (data) this.dialogref.close((data));
    else this.dialogref.close();
  }

  savePerson(person: any) {
    if (this.data.people_ids.includes(person.credit_people_id)) this.alertService.error('Persona ya registrada', ['Por favor selecciona una persona que no a sido seleccionado en esta semana'])
    else this.close({ credit_people_id: person.credit_people_id, credit_people_name: person.credit_people_name });
  }

}
