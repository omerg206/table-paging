export interface TableData {
    id: number;
    description: string;
    date: Date | number;
    author: string;
    email: string;
    system: number;
}



export interface GetTableDateFilters<T = TableData> {
    pageNumber: number;
    pageSize: number;
    sortOrder: 'desc' | 'asc';
    sortFieldName: keyof TableData;
    idKey: keyof T;
    nextOrPreviousPage: "nextPage" | "previousPage";
    sortValue?: string | number | Date  | null;
    sortId?: number | null;
    dateFilter?: Date | number;
    textFilter?: string;
}

export interface TableData {
    "id": number;
    "author": string;
    "email": string;
    "date": number | Date;
    "description": string;
    "system": number;

}


export interface ServerGetTableDataReposes {
    payload: {
        data: TableData[];
        totalResultCount: number;
    }
}