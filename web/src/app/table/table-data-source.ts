


import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { Observable, BehaviorSubject, of, Subject } from "rxjs";
import { catchError, finalize, first, map } from 'rxjs/operators';
import { GetTableDateFilters, TableData, NextOrPrevPage, ServerGetTableDataReposes } from '../../../../shared/table-data.type';
import { TableService } from '../table.service';
import { GetTableDataQuery } from '../../generated/graphql';
import { ApolloQueryResult } from "@apollo/client/core";



export class TableDataSource implements DataSource<TableData> {

  private tableDataSubject = new BehaviorSubject<TableData[]>([]);

  private loadingSubject = new BehaviorSubject<boolean>(false);

  public loading$ = this.loadingSubject.asObservable();

  private totalDataNum$: Subject<number> = new Subject<number>();


  public getTotalDataNum$: Observable<number> = this.totalDataNum$.asObservable();

  private destroy$: Subject<number> = new Subject<number>();


  constructor(private tableService: TableService) {

  }


  async loadData(params: GetTableDateFilters) {
    this.loadingSubject.next(true);

    await this.tableService.getTableData(params).pipe(
      map((tableData: ApolloQueryResult<GetTableDataQuery>) => {

        if (tableData) {
          this.tableDataSubject.next(tableData.data.getTableData.payload?.data as TableData[]);
          this.totalDataNum$.next(tableData.data.getTableData.payload?.totalResultCount as number);
        }
      }, first()),
      catchError((err) => {
        console.log(err);
        return of(null)
      }),
      finalize(() => this.loadingSubject.next(false))
    ).toPromise();

  }


  private getElementByIdx(index: number): undefined | TableData {
    return this.tableDataSubject.getValue()[index];
  }

  getSortValueAndId(isGetNextPage: NextOrPrevPage, idFieldKey: keyof TableData, sortFiledKey: keyof TableData): Pick<GetTableDateFilters, "sortValue" | "sortId"> {
    const eleIdx: number = isGetNextPage === "nextPage" ? this.tableDataSubject.getValue().length - 1 : 0
    const element = this.getElementByIdx(eleIdx)

    return {
      sortId: element ? element[idFieldKey] as number : undefined,
      sortValue: element ? element[sortFiledKey] : undefined
    }
  }


  connect(collectionViewer: CollectionViewer): Observable<TableData[]> {
    return this.tableDataSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.tableDataSubject.complete();
    this.loadingSubject.complete();
    this.totalDataNum$.complete();
    this.destroy$.next();
    this.destroy$.complete();
  }


}

