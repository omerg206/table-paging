


import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { Observable, BehaviorSubject, of, Subject } from "rxjs";
import { catchError, finalize } from "rxjs/operators";
import { GetTableDateFilters,  TableData } from '../../../../shared/table-data.type';
import { TableService } from '../table.service';



export class TableDataSource implements DataSource<TableData> {

  private tableDataSubject = new BehaviorSubject<TableData[]>([]);

  private loadingSubject = new BehaviorSubject<boolean>(false);

  public loading$ = this.loadingSubject.asObservable();

  private totalDataNum$: Subject<number> = new Subject<number>();

  public getTotalDataNum$: Observable<number> = this.totalDataNum$.asObservable();

  constructor(private tableService: TableService) {

  }


  loadData(params: GetTableDateFilters) {
    this.loadingSubject.next(true);

    this.tableService.getTableData(params).pipe(
      catchError(() => of([])),
      finalize(() => this.loadingSubject.next(false))
    )
      .subscribe((tableData: any) => {
        this.tableDataSubject.next(tableData.payload.data);
        this.totalDataNum$.next(tableData.payload.totalResultCount);
      });
  }


  private getElementByIdx(index: number): undefined | TableData {
    return this.tableDataSubject.getValue()[index];
  }

  getSortValueAndId(isGetNextPage: "nextPage" | "previousPage", idFieldKey: keyof TableData, sortFiledKey: keyof TableData): Pick<GetTableDateFilters, "sortValue" | "sortId"> {
    const eleIdx: number = isGetNextPage === "nextPage" ? this.tableDataSubject.getValue().length - 1 : 0
    const element = this.getElementByIdx(eleIdx)

    return {
      sortId:element ? element[idFieldKey] as number: undefined,
      sortValue: element ? element[sortFiledKey] : undefined
    }
  }


  connect(collectionViewer: CollectionViewer): Observable<TableData[]> {
    console.log("Connecting data source");
    return this.tableDataSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.tableDataSubject.complete();
    this.loadingSubject.complete();
    this.totalDataNum$.complete();
  }


}

