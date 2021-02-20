import { Routes } from './../../../shared/routes.types';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { GetTableDateFilters, ServerGetTableDataReposes, TableData } from '../../../shared/table-data.type';
import { PageEvent } from '@angular/material/paginator';

@Injectable({
  providedIn: 'root'
})
export class TableService {



  constructor(private http: HttpClient) {

  }

  getTableData(params: GetTableDateFilters): Observable<ServerGetTableDataReposes> {
    return this.http.get<ServerGetTableDataReposes>('http://localhost:3000' + Routes.GET_TABLE_DATA, {
      params: new HttpParams()
        .set('filters', JSON.stringify(params))

    })
  }






}
