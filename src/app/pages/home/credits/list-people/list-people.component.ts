import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { DecimalPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Subject, Subscription } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { CreditPeopleService } from '../../../services/credit-people.service';
import { MatDialog } from '@angular/material/dialog';
import { CreateUpdatePeopleComponent } from '../create-update-people/create-update-people.component';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-people',
  standalone: true,
  imports: [MatDividerModule, DataTablesModule, DecimalPipe, MatIconModule],
  templateUrl: './list-people.component.html',
  styleUrl: './list-people.component.css'
})
export default class ListPeopleComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild(DataTableDirective, { static: false }) dtElement!: DataTableDirective;
  dtTrigger: Subject<any> = new Subject<any>;
  dtOptions: DataTables.Settings = {};

  getAllPeopleSubscription!: Subscription;
  people: any[] = [];

  constructor(private creditPeopleService: CreditPeopleService,
    private spinner: NgxSpinnerService,
    public dialog: MatDialog,
    private router: Router) { }


  ngOnInit(): void {
    this.dtOptions = {
      language: {
        url: 'assets/i18n/Spanish.json'
      },
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
        }).sort((a: any, b: any) => b.all_credit - a.all_credit);
        this.rerender();
        this.spinner.hide();
      },
      error: e => this.spinner.hide()
    });
  }

  createPerson() {
    const createPerson = this.dialog.open(CreateUpdatePeopleComponent, {
      height: 'auto',
      maxHeight: '95vh',
      width: 'auto',
      minWidth: '350px'
    });
    createPerson.afterClosed().subscribe(response => {
      if (response) this.getAllPeople();
    });
  }

  updatePerson(person: any) {
    const updatePerson = this.dialog.open(CreateUpdatePeopleComponent, {
      height: 'auto',
      maxHeight: '95vh',
      width: 'auto',
      minWidth: '350px',
      data: person
    });
    updatePerson.afterClosed().subscribe(response => {
      if (response) this.getAllPeople();
    });
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.dtTrigger.next(this.dtOptions);
    });
  }

  saveToDetails(creadits: any) {
    if (creadits.credit_detail.length === 0) {
      Swal.fire({ icon: "error", title: 'No existen fiados en esta persona', confirmButtonColor: 'red' });
    } else {
      this.router.navigateByUrl('/home/credits/'+creadits.credit_people_id);
    }
  }

}
