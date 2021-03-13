import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { fromEvent, merge, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil, tap } from 'rxjs/operators';
import { GetTableDateFilters, NextOrPrevPage, TableData } from '../../../../shared/table-data.type';
import { LiveDataFilterService } from '../live-data-filter.service';
import { TableService } from '../table.service';
import { DateRange } from './date-picker/date-picker.component';
import { TableDataSource } from './table-data-source';
@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})

export class TableComponent implements OnInit, OnDestroy {

  dataSource!: TableDataSource;

  displayedColumns = ["id", "description", "date", "author", "email", "system", 'children'];

  pageSizeOptions: number[] = [3, 5, 10, 100, 1000, 10000];

  date: DateRange = { start: null, end: null };

  private destroy$: Subject<number> = new Subject<number>();

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  @ViewChild('input', { static: true }) input!: ElementRef;

  @ViewChild('inputMustIncludeSystem', { static: true }) inputMustIncludeSystem!: ElementRef;

  constructor(private tableService: TableService, private liveDataFilterService:LiveDataFilterService) { }



  ngOnInit(): void {
    this.dataSource = new TableDataSource(this.tableService, this.liveDataFilterService);
    this.dataSource.loadData(this.createLoadDataParams({ pageSize: this.pageSizeOptions[0] } as GetTableDateFilters));

  }




  ngAfterViewInit() {
    merge(fromEvent(this.input.nativeElement, 'keyup'), fromEvent(this.inputMustIncludeSystem.nativeElement, 'input'))
      .pipe(
        debounceTime(150),
        distinctUntilChanged(),
        tap(() => {

          this.paginator.pageIndex = 0;

          this.dataSource.loadData(this.createLoadDataParams())
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();

    this.sort.sortChange.pipe(takeUntil(this.destroy$)).subscribe(() => {
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
      ), takeUntil(this.destroy$))
      .subscribe();


    setInterval(() => {
      this.generateLiveData()
    }, 1000)
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
      dateEndFilter: this.date.end,
      FilterInBySameSystemId: +this.inputMustIncludeSystem.nativeElement.value
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


  generateLiveData() {
    const randomNumber = Math.floor(Math.random() * 100);
    const randomNumber2 = Math.floor(Math.random() * 100);
    const randomNumber3 = Math.floor(Math.random() * 100);
    const newData: TableData = {
      date: new Date().toISOString() as any,
      author: 'Author' + randomNumber,
      children: [randomNumber,randomNumber2,randomNumber3],
      description: 'bla ' + randomNumber,
      email: '' + randomNumber + '@gamil.com',
      id: 11000 + randomNumber * randomNumber,
      system: randomNumber
    }


    this.dataSource.addLiveData(newData, {...this.defaultLoadParamsOptions()});
    // setTimeout(() => {
    //  this.sort.sort({id: 'id', start: 'desc', disableClear: true})
    // }, 1000);
    // this.sort.sort({id: sortFieldName, start: sortOrder, disableClear: false})




  }



  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
