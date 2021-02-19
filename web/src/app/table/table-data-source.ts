


import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { Observable, BehaviorSubject, of, Subject } from "rxjs";
import { catchError, finalize } from "rxjs/operators";
import { GetTableDateFilters, ServerGetTableDataReposes, TableData } from '../../../../shared/table-data.type';
import { TableService } from '../table.service';



export class TableDataSource implements DataSource<TableData> {

  private tableDataSubject = new BehaviorSubject<TableData[]>([]);

  private loadingSubject = new BehaviorSubject<boolean>(false);

  public loading$ = this.loadingSubject.asObservable();

  private  totalDataNum$: Subject<number> = new Subject<number>();

  public  getTotalDataNum$: Observable<number> = this.totalDataNum$.asObservable();

  constructor(private tableService: TableService) {

  }


  loadData(params: GetTableDateFilters) {
    this.loadingSubject.next(true);

    this.tableService.getTableData(params).pipe(
        catchError(() => of([])),
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe((tableData: any)=> {
        this.tableDataSubject.next(tableData.payload.data);
        this.totalDataNum$.next(tableData.payload.totalResultCount);
        });
  }

  connect(collectionViewer: CollectionViewer): Observable<TableData[]> {
    console.log("Connecting data source");
    return this.tableDataSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.tableDataSubject.complete();
    this.loadingSubject.complete();
  }
  

}

