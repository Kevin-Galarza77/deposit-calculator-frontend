import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CreateUpdatePeopleComponent } from '../create-update-people/create-update-people.component';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { Subject, Subscription } from 'rxjs';
import { CreditPeopleService } from '../../../services/credit-people.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { AlertService } from '../../../services/alert.service';
import { DecimalPipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-people',
  standalone: true,
  imports: [MatDividerModule, DataTablesModule, DecimalPipe, MatIconModule],
  templateUrl: './list-people.component.html'
})
export default class ListPeopleComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild(DataTableDirective, { static: false }) dtElement!: DataTableDirective;
  dtTrigger: Subject<any> = new Subject<any>;
  dtOptions: DataTables.Settings = {};

  people: any[] = [];

  getAllPeopleSubscription!: Subscription;

  constructor(private alertService: AlertService,
    private creditPeopleService: CreditPeopleService,
    private spinner: NgxSpinnerService,
    private dialog: MatDialog,
    private router: Router) { }


  ngOnInit(): void {
    this.dtOptions = {
      language: { url: 'assets/i18n/Spanish.json' },
      order: [[2, 'desc']],
      lengthMenu: [10, 20, 30, 40, 50],
      dom: 'iftlp'
    };
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next(this.dtOptions);
    this.getAllPeople();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
    this.getAllPeopleSubscription?.unsubscribe();
    this.spinner.hide();
  }

  getAllPeople() {
    this.spinner.show();
    this.getAllPeopleSubscription = this.creditPeopleService.getAllPeople().subscribe({
      next: result => {
        if (result.status) this.people = result.data.map((person: any) => {
          let all_credit = 0;
          person.credit_detail.forEach((detail: any) => {
            if (detail.credit_detail_status == 1) all_credit += detail.credit_detail_value;
          });
          return { ...person, all_credit }
        });
        this.rerender();
        this.spinner.hide();
      },
      error: e => this.spinner.hide()
    });
  }

  createPerson() {
    const createPerson = this.dialog.open(CreateUpdatePeopleComponent, {
      height: 'auto', maxHeight: '95vh', width: '35%', minWidth: '350px'
    });
    createPerson.afterClosed().subscribe(response => {
      if (response) this.getAllPeople();
    });
  }

  updatePerson(person: any) {
    const updatePerson = this.dialog.open(CreateUpdatePeopleComponent, {
      height: 'auto', maxHeight: '95vh', width: '35%', minWidth: '350px', data: person
    });
    updatePerson.afterClosed().subscribe(response => {
      if (response) this.getAllPeople();
    });
  }

  saveToDetails(creadits: any) {
    if (creadits.credit_detail.length === 0) this.alertService.error('No existen fiados en esta entidad', []);
    else this.router.navigateByUrl('/home/credits/' + creadits.credit_people_id);
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.dtTrigger.next(this.dtOptions);
    });
  }

}
