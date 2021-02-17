export interface TableData{
    id: number;
    description: string;
    date: Date | number;
    author: string;
    email:string;
    system: number;
}


export interface GetTableDateFiltersResponse extends TableData {
    totalResultCount: number;
}

export interface GetTableDateFilters {
    dateFilter?: Date | number;
    sortOrder?: 'desc' | 'asc';
    sortFieldName?: keyof TableData;
    textFilter?: string;

    cursorFiledName?: string;
    cursorValue?: string | number| Date;
    cursorOrder?: 'desc' | 'asc';


    pageNumber: number;
    pageSize: number;
    totalResultCount?: number;
}