import { CurrencyPipe, DatePipe, DecimalPipe, UpperCasePipe } from '@angular/common';
import { CreateUpdateCreditDetailComponent } from '../../credits/create-update-credit-detail/create-update-credit-detail.component';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CreateDetailWeekComponent } from '../create-detail-week/create-detail-week.component';
import { CreateWeekComponent } from '../create-week/create-week.component';
import { CreditDetailService } from '../../../services/credit-detail.service';
import { WeekDetailsService } from '../../../services/week-details.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { TableComponent } from '../../components/table/table.component';
import { ActivatedRoute } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { Subscription } from 'rxjs';
import { AlertService } from '../../../services/alert.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-details-week',
  standalone: true,
  imports: [MatDividerModule, TableComponent, DatePipe, UpperCasePipe, DecimalPipe, MatIconModule, CurrencyPipe],
  templateUrl: './details-week.component.html'
})
export default class DetailsWeekComponent implements OnInit, OnDestroy {

  week_info: any = {};
  week_id: any = this.router.snapshot.params['id'];

  section: boolean = true;

  getWeekDetailSubscription!: Subscription;

  constructor(private weekDetailsService: WeekDetailsService,
    private creditDetailService: CreditDetailService,
    private alertService: AlertService,
    private spinner: NgxSpinnerService,
    private router: ActivatedRoute,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this.getInformationWeek(this.week_id);
  }

  ngOnDestroy(): void {
    this.getWeekDetailSubscription?.unsubscribe();
    this.spinner.hide();
  }

  changeSection(): void {
    this.spinner.show();
    this.section = !this.section;
    setTimeout(() => this.spinner.hide(), 1000);
  }

  getInformationWeek(week_id: any): void {
    this.spinner.show();
    this.getWeekDetailSubscription = this.weekDetailsService.getAllWeekDetailsByWeek(week_id).subscribe({
      next: result => {
        if (result.status) {
          let total_all_credits = 0;
          let total_profits = 0;
          let total_all = 0;
          this.week_info = result.data;
          this.week_info.week_details = this.week_info.week_details.map((detail: any) => {
            const profit = (detail.week_detail_product_sale_price - detail.week_detail_product_purchase_price) * detail.week_detail_quantity;
            const total = detail.week_detail_product_sale_price * detail.week_detail_quantity;
            total_profits += profit;
            total_all += total;
            return { ...detail, profit, total };
          });
          this.week_info.credit_details.forEach((credit: any) => {
            if (credit.credit_detail_status == 1) total_all_credits += credit.credit_detail_value;
          });
          this.week_info['total_all_credits'] = total_all_credits;
          this.week_info['total_profits'] = total_profits;
          this.week_info['total_all'] = total_all;
          this.week_info['burden'] = total_all - total_profits;
          this.week_info.credit_details = this.week_info.credit_details.sort((a: any, b: any) => b.credit_detail_value - a.credit_detail_value).sort((a: any, b: any) => a.credit_detail_status - b.credit_detail_status);
          this.week_info.week_details = this.week_info.week_details.sort((a: any, b: any) => b.total - a.total);

        }
        this.spinner.hide();
      },
      error: e => {
        this.alertService.errorApplication();
        this.spinner.hide();
      }
    });
  }

  newDetailWeek(): void {
    const products_id = this.week_info.week_details.map((product: any) => { return product.product_id });
    const date = this.week_info.week_date;
    const week = this.week_info.week_id;
    const createDetail = this.dialog.open(CreateDetailWeekComponent, {
      height: 'auto', maxHeight: '95vh', width: '30%', minWidth: '350px', data: { products_id, week, date, section: true }
    });
    createDetail.afterClosed().subscribe(response => {
      if (response) this.getInformationWeek(this.week_id);
    });
  }

  createCreditDetail(): void {
    const people_ids = this.week_info.credit_details.map((credit: any) => { return credit.credit_people_id });
    const date = this.week_info.week_date;
    const week = this.week_info.week_id;
    const newCreditDetail = this.dialog.open(CreateUpdateCreditDetailComponent, {
      height: 'auto', maxHeight: '95vh', width: '30%', minWidth: '350px', data: { people_ids, week, date, section: true }
    });
    newCreditDetail.afterClosed().subscribe(response => {
      if (response) this.getInformationWeek(this.week_id);
    });
  }

  updateWeek(): void {
    const week_id = this.week_info.week_id;
    const week_date = this.week_info.week_date;
    const week_alias = this.week_info.week_alias;
    const updateWeek = this.dialog.open(CreateWeekComponent, {
      height: 'auto', maxHeight: '95vh', width: 'auto', minWidth: '350px', data: { week_id, week_date, week_alias, section: false }
    });
    updateWeek.afterClosed().subscribe(response => {
      if (response) this.getInformationWeek(this.week_id);
    });
  }

  updateCreditDetail(detail: any): void {
    const date = this.week_info.week_date;
    const week = this.week_info.week_id;
    const update = this.dialog.open(CreateUpdateCreditDetailComponent, {
      height: 'auto', maxHeight: '95vh', width: '30%', minWidth: '350px',
      data: { week, date, section: false, id: detail.credit_detail_id, credit_people_id: detail.credit_people.credit_people_id, credit_people_name: detail.credit_people.credit_people_name, credit_detail_description: detail.credit_detail_description, credit_detail_value: detail.credit_detail_value, week_id: detail.week_id, credit_detail_status: detail.credit_detail_status }
    });
    update.afterClosed().subscribe(response => {
      if (response) this.getInformationWeek(this.week_id);
    });
  }

  updatelWeekDetail(detail: any): void {
    const date = this.week_info.week_date;
    const week = this.week_info.week_id;
    const update = this.dialog.open(CreateDetailWeekComponent, {
      height: 'auto', maxHeight: '95vh', width: '30%', minWidth: '350px',
      data: { section: false, date, week, id: detail.week_detail_id, product_name: detail.week_detail_product_name, product_id: detail.product_id, week_detail_quantity: detail.week_detail_quantity }
    });
    update.afterClosed().subscribe(response => {
      if (response) this.getInformationWeek(this.week_id);
    });
  }

  async deletelWeekDetailCreditQuestion(detail_id: any) {
    const question = await this.alertService.questionDelete();
    if (question) this.deletelWeekDetailCredits(detail_id);
  }

  async deletelWeekDetailQuestion(detail_id: any) {
    const question = await this.alertService.questionDelete();
    if (question) this.deletelWeekDetail(detail_id);
  }

  deletelWeekDetailCredits(detail_id: any) {
    this.spinner.show();
    this.creditDetailService.deleteCreditDetail(detail_id).subscribe({
      next: result => {
        if (result.status) {
          this.alertService.success(result.alert);
          setTimeout(() => this.getInformationWeek(this.week_id), 1000);
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

  deletelWeekDetail(detail_id: any) {
    this.spinner.show();
    this.weekDetailsService.deleteWeekDetail(detail_id).subscribe({
      next: result => {
        if (result.status) {
          this.alertService.success(result.alert);
          setTimeout(() => this.getInformationWeek(this.week_id), 1000);
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

}
