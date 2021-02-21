import { Routes } from './../../../shared/routes.types';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { GetTableDateFilters, ServerGetTableDataReposes, TableData } from '../../../shared/table-data.type';
import { PageEvent } from '@angular/material/paginator';
import {GetTableDataGQL, GetTableDataQuery} from '../generated/graphql'
import { ApolloQueryResult } from '@apollo/client/core';
@Injectable({
  providedIn: 'root'
})
export class TableService {



  constructor(private http: HttpClient, private getTableDataGQL: GetTableDataGQL) {
  }

  getTableData(params: GetTableDateFilters): Observable<ApolloQueryResult<GetTableDataQuery>> {
    return this.getTableDataGQL.fetch({input: params}, {})
  }






}
