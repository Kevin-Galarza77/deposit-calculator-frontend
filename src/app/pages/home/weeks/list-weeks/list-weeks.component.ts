import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { TableComponent } from '../../components/table/table.component';
import { MatDividerModule } from '@angular/material/divider';
import { NgxSpinnerService } from 'ngx-spinner';
import { WeeksService } from '../../../services/weeks.service';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { CreateWeekComponent } from '../create-week/create-week.component';
import { Router } from '@angular/router';
import { DatePipe, DecimalPipe, TitleCasePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-weeks',
  standalone: true,
  imports: [TableComponent, MatDividerModule, DatePipe, TitleCasePipe, MatIconModule, DecimalPipe],
  templateUrl: './list-weeks.component.html',
  styleUrl: './list-weeks.component.css'
})
export default class ListWeeksComponent implements AfterViewInit, OnDestroy {

  getAllWeekSubscription!: Subscription;

  weeks: any[] = [];

  constructor(private spinner: NgxSpinnerService,
    private weeksService: WeeksService,
    public dialog: MatDialog,
    private router: Router) { }

  ngAfterViewInit(): void {
    this.getAllWeeks();
  }

  ngOnDestroy(): void {
    this.getAllWeekSubscription?.unsubscribe();
    this.spinner.hide();
  }

  getAllWeeks() {
    this.spinner.show();
    this.getAllWeekSubscription = this.weeksService.getAllWeeks().subscribe({
      next: result => {
        if (result.status) this.weeks = result.data.map((week: any) => {
          let sold = 0;
          let burden = 0;

          week.week_details.forEach((detail: any) => {
            sold += detail.week_detail_product_sale_price * detail.week_detail_quantity;
            burden += detail.week_detail_product_purchase_price * detail.week_detail_quantity;
          });

          return { ...week, sold, burden, profit: sold - burden }
        });
        this.spinner.hide();
      },
      error: e => this.spinner.hide()
    });
  }

  createWeek() {
    const createWeek = this.dialog.open(CreateWeekComponent, {
      height: 'auto',
      maxHeight: '95vh',
      width: 'auto',
      minWidth: '350px'
    });
    createWeek.afterClosed().subscribe(response => {
      if (response) this.router.navigateByUrl('/home/weeks/' + response.week_id);
    });
  }

  deleteWeek(week_id: any) {
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
        this.weeksService.deleteWeek(week_id).subscribe({
          next: result => {
            if (result.status) {
              Swal.fire({ icon: "success", title: result.alert, showConfirmButton: false, timer: 1500 });
              setTimeout(() => this.getAllWeeks(), 1000);
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

  showWeek(week: any) {
    this.router.navigateByUrl('/home/weeks/' + week.week_id);
  }

}
