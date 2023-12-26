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
@Component({
  selector: 'app-details-week',
  standalone: true,
  imports: [MatDividerModule, TableComponent, DatePipe, TitleCasePipe, DecimalPipe, MatIconModule, CurrencyPipe],
  templateUrl: './details-week.component.html',
  styleUrl: './details-week.component.css'
})
export default class DetailsWeekComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild(TableComponent) table!: TableComponent;

  week_id: any = this.router.snapshot.params['id'];
  week_info: any = {};

  getWeekDetailSubscription!: Subscription;

  constructor(private spinner: NgxSpinnerService,
    private weekDetailsService: WeekDetailsService,
    private router: ActivatedRoute) {
  }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    this.getInformationWeek(this.week_id);
  }

  ngOnDestroy(): void {

  }

  getInformationWeek(week_id: any) {
    this.spinner.show(); 9
    this.getWeekDetailSubscription = this.weekDetailsService.getAllWeekDetailsByWeek(week_id).subscribe({
      next: result => {
        if (result.status) {
          this.week_info = result.data;
          let total_profits = 0;
          let total_all = 0;
          this.week_info.week_details = this.week_info.week_details.map((detail: any) => {
            const profit = (detail.week_detail_product_sale_price - detail.week_detail_product_purchase_price) * detail.week_detail_quantity;
            const total = detail.week_detail_product_sale_price * detail.week_detail_quantity;
            total_profits += profit;
            total_all += total;
            return { ...detail, profit, total };
          });
          this.week_info['total_profits'] = total_profits;
          this.week_info['total_all'] = total_all;
          this.week_info['burden'] = total_all - total_profits;
        }
        this.spinner.hide();
      },
      error: e => {
        Swal.fire({ icon: "error", title: 'Se produjo un error contacta al administrador', showConfirmButton: false, timer: 1500 });
        this.spinner.hide();
      }
    });
  }


}
