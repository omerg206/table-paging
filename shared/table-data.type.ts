export interface TableData {
    id: number;
    description: string;
    date: Date | number;
    author: string;
    email: string;
    system: number;
    children: number[];
}



export type SortDirection = 'desc' | 'asc';
export type NextOrPrevPage = "nextPage" | "previousPage";

export interface GetTableDateFilters<T = TableData> {
    pageNumber: number;
    pageSize: number;
    sortOrder: SortDirection;
    sortFieldName: keyof TableData;
    idKey: keyof T;
    dateKey: keyof T;
    nextOrPreviousPage: NextOrPrevPage;
    sortValue?: any;
    sortId?: number | null;
    dateStartFilter?: any;
    dateEndFilter?: any;
    textFilter?: string;
    FilterInBySameSystemId? : number
}



export interface ServerGetTableDataReposes {
    payload: {
        data: TableData[];
        totalResultCount: number;
    }
}