import { Injectable } from '@angular/core';
import { some } from 'lodash';
import { TableData, GetTableDateFilters } from '../../../shared/table-data.type';

@Injectable({
  providedIn: 'root'
})
export class LiveDataFilterService {

  constructor() { }


  getIndexOfNewData(currentData:TableData[], data: TableData, filters: Pick<GetTableDateFilters, 'sortFieldName' | 'sortOrder' | "FilterInBySameSystemId" | "textFilter" | 'pageSize'>): number{
    let insertIdx = -1;
    if (this.isNewDataPassAllNonFilters(data, { ...filters })) {
       insertIdx=  currentData.findIndex((ele: TableData) => this.comparisonFunction(ele, data, filters));;

      if (this.isCorrectInsertIndexIfThePageInNotFull(insertIdx, currentData.length, {...filters})) {
        //element must be added to page, there is room in the page and it passed the date + text filters
        insertIdx = filters.sortOrder === 'asc' ? currentData.length : 0
      }
    }

    return insertIdx;
  }

  private isDataIncludesInFilterText(data: TableData, { textFilter }: Pick<GetTableDateFilters, "textFilter">) {
    return some(data, (val: any, key: string) => val.toString().toLowerCase().includes(textFilter!.toLowerCase()))
  }

  private isCorrectInsertIndexIfThePageInNotFull(insertIdx: number, currentDataLength:number, { pageSize }: Pick<GetTableDateFilters, "pageSize">): boolean{
   return  insertIdx === -1 && currentDataLength < pageSize
  }

  private isNewDataPassAllNonFilters(data: TableData, filters: Pick<GetTableDateFilters, 'sortFieldName' | 'sortOrder' | "FilterInBySameSystemId" | "textFilter" | 'pageSize' | "dateEndFilter" | "dateStartFilter">): boolean{
    return this.isDataIncludesInFilterText(data, { ...filters }) &&
     this.isDataIncludesSameSystemId(data, { ...filters }) && this.isDataInDateRange(data, { ...filters })
  }

  private isDataIncludesSameSystemId(data: TableData, { FilterInBySameSystemId }: Pick<GetTableDateFilters, "FilterInBySameSystemId">) {
    return FilterInBySameSystemId! === 0 || data.children.some((systemId: number) => systemId === FilterInBySameSystemId)
  }

  private isDataInDateRange(data: TableData, { dateStartFilter, dateEndFilter }: Pick<GetTableDateFilters, "dateStartFilter" | "dateEndFilter">) {
    return (dateStartFilter == null || new Date(data.date) >= new Date(dateStartFilter)) &&
    (dateEndFilter == null || new Date(data.date) <= new Date(dateEndFilter))
  }

  private comparisonFunction(currentEle: TableData, data: TableData, { sortFieldName, sortOrder, FilterInBySameSystemId, textFilter }: Pick<GetTableDateFilters, 'sortFieldName' | 'sortOrder' | "FilterInBySameSystemId" | "textFilter">): boolean {
    let currentVal = currentEle[sortFieldName];
    let newDataVal = data[sortFieldName];

    if (typeof currentEle[sortFieldName] === 'string') {
      currentVal = currentEle[sortFieldName].toString().toLowerCase();
      newDataVal = data[sortFieldName].toString().toLowerCase();
    }
    return sortOrder === 'asc' ? currentVal >= newDataVal : currentVal <= newDataVal

  }

}
