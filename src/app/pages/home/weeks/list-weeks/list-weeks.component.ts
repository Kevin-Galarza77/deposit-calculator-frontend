import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DatePipe, DecimalPipe, UpperCasePipe } from '@angular/common';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { Subject, Subscription } from 'rxjs';
import { CreateWeekComponent } from '../create-week/create-week.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { TableComponent } from '../../components/table/table.component';
import { MatIconModule } from '@angular/material/icon';
import { WeeksService } from '../../../services/weeks.service';
import { AlertService } from '../../../services/alert.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-weeks',
  standalone: true,
  imports: [TableComponent, MatDividerModule, DatePipe, UpperCasePipe, MatIconModule, DecimalPipe, DataTablesModule],
  templateUrl: './list-weeks.component.html'
})
export default class ListWeeksComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild(DataTableDirective, { static: false }) dtElement!: DataTableDirective;
  dtTrigger: Subject<any> = new Subject<any>;
  dtOptions: DataTables.Settings = {};

  weeks: any[] = [];

  getAllWeekSubscription!: Subscription;

  constructor(private alertService: AlertService,
    private weeksService: WeeksService,
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
    this.getAllWeeks();
  }

  ngOnDestroy(): void {
    this.dtTrigger?.unsubscribe();
    this.getAllWeekSubscription?.unsubscribe();
    this.spinner.hide();
  }

  getAllWeeks(): void {
    this.spinner.show();
    this.getAllWeekSubscription = this.weeksService.getAllWeeks().subscribe({
      next: result => {
        if (result.status) this.weeks = result.data.map((week: any) => {
          let burden = 0;
          let sold = 0;
          week.week_details.forEach((detail: any) => {
            burden += detail.week_detail_product_purchase_price * detail.week_detail_quantity;
            sold += detail.week_detail_product_sale_price * detail.week_detail_quantity;
          });
          return { ...week, sold, burden, profit: sold - burden }
        });
        this.rerender();
        this.spinner.hide();
      },
      error: e => this.spinner.hide()
    });
  }

  createWeek(): void {
    const createWeek = this.dialog.open(CreateWeekComponent, {
      height: 'auto', maxHeight: '95vh', width: '25%', minWidth: '300px'
    });
    createWeek.afterClosed().subscribe(response => {
      if (response) this.router.navigateByUrl('/home/weeks/' + response.week_id);
    });
  }

  async deleteWeekQuestion(week_id: any): Promise<void> {
    const question = await this.alertService.questionDelete();
    if (question) this.deleteWeek(week_id);
  }

  deleteWeek(week_id: any): void {
    this.spinner.show();
    this.weeksService.deleteWeek(week_id).subscribe({
      next: result => {
        if (result.status) {
          this.alertService.success(result.alert);
          setTimeout(() => this.getAllWeeks(), 1000);
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

  showWeek(week: any): void {
    this.router.navigateByUrl('/home/weeks/' + week.week_id);
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.dtTrigger.next(this.dtOptions);
    });
  }

}
