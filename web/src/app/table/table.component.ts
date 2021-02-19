import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { fromEvent, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, startWith, tap, delay } from 'rxjs/operators';
import { GetTableDateFilters, TableData } from '../../../../shared/table-data.type';
import { TableService } from '../table.service';
import { TableDataSource } from './table-data-source';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})

export class TableComponent implements OnInit {

  dataSource!: TableDataSource;

  displayedColumns = ["id", "description", "date", "author", "email", "system"];

  pageSizeOptions: number[] =  [3,5,10];


  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  @ViewChild('input', { static: true }) input!: ElementRef;

  constructor(private tableService: TableService) { }

  ngOnInit(): void {
    this.dataSource = new TableDataSource(this.tableService);

    this.dataSource.loadData(this.createLoadDataParams({pageSize: this.pageSizeOptions[0]} as GetTableDateFilters));
  }

  ngAfterViewInit() {

    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    fromEvent(this.input.nativeElement, 'keyup')
      .pipe(
        debounceTime(150),
        distinctUntilChanged(),
        tap(() => {
          this.paginator.pageIndex = 0;

          this.dataSource.loadData(this.createLoadDataParams({} as GetTableDateFilters))
        })
      )
      .subscribe();

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => this.dataSource.loadData(this.createLoadDataParams({} as GetTableDateFilters)))
      )
      .subscribe();

  }

  createLoadDataParams({ pageNumber = this.paginator.pageIndex,
    pageSize = this.paginator.pageSize,
    textFilter = this.input.nativeElement.value,
    sortFieldName = this.sort.active as keyof TableData,
    sortOrder = this.sort.direction === '' ? 'asc' : this.sort.direction,
  }: GetTableDateFilters): GetTableDateFilters {
    return {
      pageNumber,
      pageSize,
      textFilter,
      sortFieldName,
      sortOrder
    }
  }



}
