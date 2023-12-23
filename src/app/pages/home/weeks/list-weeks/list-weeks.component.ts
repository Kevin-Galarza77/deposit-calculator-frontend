import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { TableComponent } from '../../components/table/table.component';
import { MatDividerModule } from '@angular/material/divider';
import { NgxSpinnerService } from 'ngx-spinner';
import { WeeksService } from '../../../services/weeks.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-list-weeks',
  standalone: true,
  imports: [TableComponent, MatDividerModule],
  templateUrl: './list-weeks.component.html',
  styleUrl: './list-weeks.component.css'
})
export default class ListWeeksComponent implements AfterViewInit, OnDestroy {

  @ViewChild(TableComponent) table!: TableComponent;
  getAllWeekSubscription!: Subscription;

  constructor(private spinner: NgxSpinnerService,
    private weeksService: WeeksService) {

  }

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
        if (result.status) this.table.rerender(result.data);
        this.spinner.hide();
      },
      error: e => this.spinner.hide()
    });
  }

}
