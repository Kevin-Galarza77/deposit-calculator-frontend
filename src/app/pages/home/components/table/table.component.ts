import { AfterViewInit, Component, Input, Output, EventEmitter, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { Subject } from 'rxjs';


@Component({
  selector: 'app-table',
  standalone: true,
  imports: [DataTablesModule, MatIconModule],
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
  @Input() keyIF: string = '';
  @Input() valueIF: string = '';
  @Input() onlyUpdate: boolean = true;


  @Output() newEventEmitter = new EventEmitter();
  @Output() updateEventEmitter = new EventEmitter();
  @Output() showEventEmitter = new EventEmitter();

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

  newElement() {
    this.newEventEmitter.emit(null);
  }

  updateElement(element: any) {
    this.updateEventEmitter.emit(element);
  }

  showElement(element: any) {
    this.showEventEmitter.emit(element);
  }

}
