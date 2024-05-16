import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { CreditPeopleService } from '../../../services/credit-people.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { ActivatedRoute } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { DecimalPipe } from '@angular/common';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-list-credit-details',
  standalone: true,
  imports: [MatDividerModule, MatIconModule, DecimalPipe, DataTablesModule],
  templateUrl: './list-credit-details.component.html'
})
export default class ListCreditDetailsComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild(DataTableDirective, { static: false }) dtElement!: DataTableDirective;
  dtTrigger: Subject<any> = new Subject<any>;
  dtOptions: DataTables.Settings = {};

  info: any = {};

  person_id: any = this.router.snapshot.params['person'];

  constructor(private creditPeopleService: CreditPeopleService,
    private spinner: NgxSpinnerService,
    private router: ActivatedRoute) { }

  ngOnInit(): void {
    this.dtOptions = {
      language: { url: 'assets/i18n/Spanish.json' },
      lengthMenu: [10, 20, 30, 40, 50],
      dom: 'iftlp'
    };
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next(this.dtOptions);
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
    this.spinner.hide();
  }

  updateCreditDetail(detail: any) {

  }

  deletelWeekDetailCredit(detail: any) {

  }

}
