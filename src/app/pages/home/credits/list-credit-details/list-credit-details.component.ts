import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { DatePipe, DecimalPipe, UpperCasePipe } from '@angular/common';
import { CreateUpdateCreditDetailComponent } from '../create-update-credit-detail/create-update-credit-detail.component';
import { CreditPeopleService } from '../../../services/credit-people.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { ActivatedRoute } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AlertService } from '../../../services/alert.service';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { CreditDetailService } from '../../../services/credit-detail.service';

@Component({
  selector: 'app-list-credit-details',
  standalone: true,
  imports: [MatDividerModule, MatIconModule, DecimalPipe, DataTablesModule, DatePipe, UpperCasePipe],
  templateUrl: './list-credit-details.component.html'
})
export default class ListCreditDetailsComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild(DataTableDirective, { static: false }) dtElement!: DataTableDirective;
  dtTrigger: Subject<any> = new Subject<any>;
  dtOptions: DataTables.Settings = {};

  info: any = null;

  person_id: any = this.router.snapshot.params['person'];

  constructor(private creditPeopleService: CreditPeopleService,
    private creditDetailService: CreditDetailService,
    private alertService: AlertService,
    private spinner: NgxSpinnerService,
    private router: ActivatedRoute,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this.dtOptions = {
      language: { url: 'assets/i18n/Spanish.json' },
      order: [[5, 'desc']],
      lengthMenu: [10, 20, 30, 40, 50],
      dom: 'iftlp'
    };
    this.info = this.creditPeopleService.detaisPerson;
  }

  ngAfterViewInit(): void {
    this.dtTrigger?.next(this.dtOptions);
  }

  ngOnDestroy(): void {
    this.dtTrigger?.unsubscribe();
    this.spinner.hide();
  }

  updateCreditDetail(detail: any): void {
    const date = detail.week.week_date;
    const week = detail.week.week_id;
    const update = this.dialog.open(CreateUpdateCreditDetailComponent, {
      height: 'auto', maxHeight: '95vh', width: '30%', minWidth: '350px',
      data: { week, date, section: false, id: detail.credit_detail_id, credit_people_id: detail.credit_people_id, credit_people_name: this.info.credit_people_name, credit_detail_description: detail.credit_detail_description, credit_detail_value: detail.credit_detail_value, week_id: detail.week.week_id, credit_detail_status: detail.credit_detail_status }
    });
    update.afterClosed().subscribe(response => {
      if (response) {
        detail.credit_detail_description = response.credit_detail_description;
        detail.credit_detail_status = response.credit_detail_status;
        detail.credit_detail_value = response.credit_detail_value;
        this.rerender();
      }
    });
  }

  async deletelWeekDetailCreditQuestion(detail_id: any, position: any) {
    const question = await this.alertService.questionDelete();
    if (question) this.deletelWeekDetailCredits(detail_id, position);
  }

  deletelWeekDetailCredits(detail_id: any, position: any) {
    this.spinner.show();
    this.creditDetailService.deleteCreditDetail(detail_id).subscribe({
      next: result => {
        if (result.status) {
          this.alertService.success(result.alert);
          setTimeout(() => {
            this.info.credit_detail.splice(position, 1);
            this.rerender();
          }, 1000);
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

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.dtTrigger.next(this.dtOptions);
    });
  }

}
