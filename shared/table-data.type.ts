export interface TableData {
    id: number;
    description: string;
    date: Date | number;
    author: string;
    email: string;
    system: number;
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
    sortValue?: string | number | Date  | null;
    sortId?: number | null;
    dateStartFilter?: Date | number | string | null;
    dateEndFilter?: Date | number | string|  null;
    textFilter?: string;
}



export interface ServerGetTableDataReposes {
    payload: {
        data: TableData[];
        totalResultCount: number;
    }
}