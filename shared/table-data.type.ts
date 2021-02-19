export interface TableData {
    id: number;
    description: string;
    date: Date | number;
    author: string;
    email: string;
    system: number;
}



export interface GetTableDateFilters {
    dateFilter?: Date | number;
    sortOrder?: 'desc' | 'asc';
    sortFieldName?: keyof TableData;
    textFilter?: string;

    cursorFiledName?: string;
    cursorValue?: string | number | Date;
    cursorOrder?: 'desc' | 'asc';
    cursorId?: number;


    pageNumber: number;
    pageSize: number;
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