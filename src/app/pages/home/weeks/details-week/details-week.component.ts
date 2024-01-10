import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { TableComponent } from '../../components/table/table.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { WeekDetailsService } from '../../../services/week-details.service';
import { CurrencyPipe, DatePipe, DecimalPipe, TitleCasePipe } from '@angular/common';
import Swal from 'sweetalert2';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { CreateDetailWeekComponent } from '../create-detail-week/create-detail-week.component';
import { CreateWeekComponent } from '../create-week/create-week.component';
import { CreateUpdateCreditDetailComponent } from '../../credits/create-update-credit-detail/create-update-credit-detail.component';
import { CreditDetailService } from '../../../services/credit-detail.service';
@Component({
  selector: 'app-details-week',
  standalone: true,
  imports: [MatDividerModule, TableComponent, DatePipe, TitleCasePipe, DecimalPipe, MatIconModule, CurrencyPipe],
  templateUrl: './details-week.component.html',
  styleUrl: './details-week.component.css'
})
export default class DetailsWeekComponent implements OnInit, OnDestroy {

  @ViewChild(TableComponent) table!: TableComponent;

  week_id: any = this.router.snapshot.params['id'];
  week_info: any = {};

  getWeekDetailSubscription!: Subscription;

  constructor(private weekDetailsService: WeekDetailsService,
    private creditDetailService: CreditDetailService,
    private spinner: NgxSpinnerService,
    private router: ActivatedRoute,
    public dialog: MatDialog) { }

  ngOnInit(): void {
    this.getInformationWeek(this.week_id);
  }

  ngOnDestroy(): void {
    this.getWeekDetailSubscription?.unsubscribe();
    this.spinner.hide();
  }

  getInformationWeek(week_id: any) {
    this.spinner.show(); 9
    this.getWeekDetailSubscription = this.weekDetailsService.getAllWeekDetailsByWeek(week_id).subscribe({
      next: result => {
        if (result.status) {
          this.week_info = result.data;
          let total_profits = 0;
          let total_all = 0;
          let total_all_credits = 0;
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
          this.week_info['total_profits'] = total_profits;
          this.week_info['total_all'] = total_all;
          this.week_info['burden'] = total_all - total_profits;
          this.week_info['total_all_credits'] = total_all_credits;
          this.week_info.week_details = this.week_info.week_details.sort((a: any, b: any) => b.total - a.total);
          this.week_info.credit_details = this.week_info.credit_details.sort((a: any, b: any) => b.credit_detail_value - a.credit_detail_value).sort((a: any, b: any) => a.credit_detail_status - b.credit_detail_status);
        }
        this.spinner.hide();
      },
      error: e => {
        Swal.fire({ icon: "error", title: 'Se produjo un error contacta al administrador', showConfirmButton: false, timer: 1500 });
        this.spinner.hide();
      }
    });
  }

  newDetailWeek() {
    const products_id = this.week_info.week_details.map((product: any) => { return product.product_id });
    const date = this.week_info.week_date;
    const week = this.week_info.week_id;
    const createDetail = this.dialog.open(CreateDetailWeekComponent, {
      height: 'auto',
      maxHeight: '95vh',
      width: 'auto',
      minWidth: '350px',
      data: { products_id, week, date, section: true }
    });
    createDetail.afterClosed().subscribe(response => {
      if (response) this.getInformationWeek(this.week_id);
    });
  }

  createCreditDetail() {
    const people_ids = this.week_info.credit_details.map((credit: any) => { return credit.credit_people_id });
    const date = this.week_info.week_date;
    const week = this.week_info.week_id;
    const newCreditDetail = this.dialog.open(CreateUpdateCreditDetailComponent, {
      height: 'auto',
      maxHeight: '95vh',
      width: 'auto',
      minWidth: '350px',
      data: { people_ids, week, date, section: true }
    });
    newCreditDetail.afterClosed().subscribe(response => {
      if (response) this.getInformationWeek(this.week_id);
    });
  }

  updateCreditDetail(detail: any) {
    const date = this.week_info.week_date;
    const week = this.week_info.week_id;
    const update = this.dialog.open(CreateUpdateCreditDetailComponent, {
      height: 'auto',
      maxHeight: '95vh',
      width: 'auto',
      minWidth: '350px',
      data: {  week, date, section: false, id: detail.credit_detail_id, credit_people_id: detail.credit_people.credit_people_id, credit_people_name: detail.credit_people.credit_people_name, credit_detail_description: detail.credit_detail_description, credit_detail_value: detail.credit_detail_value, week_id: detail.week_id, credit_detail_status: detail.credit_detail_status }
    });
    update.afterClosed().subscribe(response => {
      if (response) this.getInformationWeek(this.week_id);
    });
  }

  updatelWeekDetail(detail: any) {
    const date = this.week_info.week_date;
    const week = this.week_info.week_id;
    const update = this.dialog.open(CreateDetailWeekComponent, {
      height: 'auto',
      maxHeight: '95vh',
      width: 'auto',
      minWidth: '350px',
      data: { section: false, date, week, id: detail.week_detail_id, product_name: detail.week_detail_product_name, product_id: detail.product_id, week_detail_quantity: detail.week_detail_quantity }
    });
    update.afterClosed().subscribe(response => {
      if (response) this.getInformationWeek(this.week_id);
    });
  }

  deletelWeekDetail(detail_id: any) {
    Swal.fire({
      title: "Estas seguro de realizar esta acción?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      confirmButtonColor: 'rgb(220, 53, 69)',
      cancelButtonText: "Cancelar",
      cancelButtonColor: 'rgb(108, 117, 125)',
      reverseButtons: true
    }).then(result => {
      if (result.isConfirmed) {
        this.spinner.show();
        this.weekDetailsService.deleteWeekDetail(detail_id).subscribe({
          next: result => {
            if (result.status) {
              Swal.fire({ icon: "success", title: result.alert, showConfirmButton: false, timer: 1500 });
              setTimeout(() => this.getInformationWeek(this.week_id), 1000);
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
    });
  }

  updateWeek() {
    const week = this.week_info.week_id;
    const date = this.week_info.week_date;
    const updateWeek = this.dialog.open(CreateWeekComponent, {
      height: 'auto',
      maxHeight: '95vh',
      width: 'auto',
      minWidth: '350px',
      data: { week, date, section: false }
    });
    updateWeek.afterClosed().subscribe(response => {
      if (response) this.getInformationWeek(this.week_id);
    });
  }
  
  deletelWeekDetailCredit(detail_id: any) {
    Swal.fire({
      title: "Estas seguro de realizar esta acción?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      confirmButtonColor: 'rgb(220, 53, 69)',
      cancelButtonText: "Cancelar",
      cancelButtonColor: 'rgb(108, 117, 125)',
      reverseButtons: true
    }).then(result => {
      if (result.isConfirmed) {
        this.spinner.show();
        this.creditDetailService.deleteCreditDetail(detail_id).subscribe({
          next: result => {
            if (result.status) {
              Swal.fire({ icon: "success", title: result.alert, showConfirmButton: false, timer: 1500 });
              setTimeout(() => this.getInformationWeek(this.week_id), 1000);
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
    });
  }

}
