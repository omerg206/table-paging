import { GetTableDateFilters } from "../../shared/table-data.type";
import bodybuilder from 'bodybuilder';




export const createGetTableDataFilterElasticQuery = (filters: GetTableDateFilters, isCursorFieldOfText: boolean, isSortFieldOfTextType: boolean): any => {
    let filterQuery = bodybuilder().size(+filters.pageSize || 10000);


    if (filters.textFilter) {
        filterQuery.query('multi_match', 'query', filters.textFilter, {
            "fields": ["test"], "operator": "and", "analyzer": "my_analyzer"
        })
    }

    if (filters.sortFieldName) {
        filterQuery.sort(getFiledNameForRangeQuery(filters, "sortFieldName", isSortFieldOfTextType), filters.sortOrder || 'desc')
    }

    if (filters.dateFilter) {
        filterQuery.query("range", "date", { lte: filters.dateFilter })
    }

    if (filters.cursorValue) {
        filterQuery.query("range", getFiledNameForRangeQuery(filters, "cursorFiledName", isCursorFieldOfText), getCursorRange(filters)) //cursor filter 
    }

    return filterQuery.build();
}


const getCursorRange = (filters: GetTableDateFilters): Object => {
    return { [`${filters.cursorOrder === 'asc' ? 'gte' : 'lte'}`]: filters.cursorValue }
}

const getFiledNameForRangeQuery = (filters: GetTableDateFilters, fieldName: keyof GetTableDateFilters, isTextType: boolean): string => {
    return `${filters[fieldName]}${isTextType ? '.keyword' : ''}`;
}