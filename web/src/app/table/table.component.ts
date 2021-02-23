import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { fromEvent, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, startWith, tap, delay, first } from 'rxjs/operators';
import { GetTableDateFilters, TableData, NextOrPrevPage } from '../../../../shared/table-data.type';
import { TableService } from '../table.service';
import { TableDataSource } from './table-data-source';
import { DateRange } from './date-picker/date-picker.component';
import { GetTableDataGQL, GetTableDataDocument } from '../../generated/graphql';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})

export class TableComponent implements OnInit {

  dataSource!: TableDataSource;

  displayedColumns = ["id", "description", "date", "author", "email", "system"];

  pageSizeOptions: number[] = [3, 5, 10, 100, 1000, 10000];

  date: DateRange  = {start: null, end: null};


  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  @ViewChild('input', { static: true }) input!: ElementRef;

  constructor(private tableService: TableService) { }

  ngOnInit(): void {
    this.dataSource = new TableDataSource(this.tableService);

    this.dataSource.loadData(this.createLoadDataParams({ pageSize: this.pageSizeOptions[0] } as GetTableDateFilters));
  }




  ngAfterViewInit() {

    fromEvent(this.input.nativeElement, 'keyup')
      .pipe(
        debounceTime(150),
        distinctUntilChanged(),
        tap(() => {

          this.paginator.pageIndex = 0;

          this.dataSource.loadData(this.createLoadDataParams())
        })
      )
      .subscribe();

    this.sort.sortChange.subscribe(() => {
      this.paginator.pageIndex = 0;
      this.dataSource.loadData(this.createLoadDataParams())
    });


    this.paginator.page.pipe(
      debounceTime(100),
      tap((pageEvent: PageEvent) => {
        let sortValueAndId;
        let nextOrPreviousPage: NextOrPrevPage = "nextPage";

        if (this.isPageChange(pageEvent)) {
          nextOrPreviousPage = pageEvent.pageIndex > pageEvent.previousPageIndex! ? 'nextPage' : 'previousPage'
          sortValueAndId = this.dataSource.getSortValueAndId(nextOrPreviousPage, "id", this.sort.active as keyof TableData)
        }

        this.dataSource.loadData(this.createLoadDataParams({ ...sortValueAndId, nextOrPreviousPage }))

      }
      ))
      .subscribe();

  }

  onDateChange(date: DateRange | null) {
    if (date) {
      this.dataSource.loadData(this.createLoadDataParams({ dateStartFilter: date.start, dateEndFilter: date.end }))
      this.date = date;
    }
  }

  defaultLoadParamsOptions(): GetTableDateFilters {
    return {
      pageNumber: this.paginator.pageIndex,
      pageSize: this.paginator.pageSize,
      textFilter: this.input.nativeElement.value,
      sortFieldName: this.sort.active as keyof TableData,
      sortOrder: this.sort.direction === '' ? 'asc' : this.sort.direction,
      nextOrPreviousPage: "nextPage",
      sortId: null,
      sortValue: null,
      idKey: 'id',
      dateKey: 'date',
      dateStartFilter: this.date.start,
      dateEndFilter: this.date.end
    }
  }

  createLoadDataParams(params: Partial<GetTableDateFilters> = {}): GetTableDateFilters {
    const defaultsParams = this.defaultLoadParamsOptions();

    return { ...defaultsParams, ...params };
  }

  isPageChange(pageEvent: PageEvent): boolean {
    return pageEvent.previousPageIndex != null && pageEvent.pageIndex !== pageEvent.previousPageIndex
  }

  trackByFunc(index: number, item: TableData) {
    return item.id
  }

}
