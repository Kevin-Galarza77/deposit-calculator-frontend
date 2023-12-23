import { AfterViewInit, Component, Input, Output, EventEmitter, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { Subject } from 'rxjs';


@Component({
  selector: 'app-table',
  standalone: true,
  imports: [DataTablesModule,MatIconModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css'
})
export class TableComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild(DataTableDirective, { static: false }) dtElement!: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>;

  data: any = [];

  @Input() columnNames: any = [];
  @Input() valuesColumn: any = [];
  @Input() new: any = [];

  @Output() updateEventEmitter = new EventEmitter();

  ngOnInit(): void {
    this.dtOptions = {
      language: {
        url: 'assets/i18n/Spanish.json'
      },
      lengthMenu: [5, 15, 25, 30, 50],
      dom: 'iftlp'
    };
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next(this.dtOptions);
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  rerender(data: any): void {
    this.data = data;
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.dtTrigger.next(this.dtOptions);
    });
  }

  updateElement(element: any) {
    this.updateEventEmitter.emit(element);
  }

}
