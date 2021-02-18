import { GetTableDateFilters } from "../../shared/table-data.type";
import bodybuilder, { Bodybuilder } from 'bodybuilder';




export const createGetTableDataFilterElasticQuery = (filters: GetTableDateFilters, isCursorFieldOfText: boolean, isSortFieldOfTextType: boolean): any => {
    let filterQuery = bodybuilder().size(+filters.pageSize || 10000);


    if (filters.textFilter) {
        filterQuery.query('multi_match', 'query', filters.textFilter, {
            "fields": ["test"], "operator": "and", "analyzer": "my_analyzer"
        })
    }

    if (filters.sortFieldName) {
        setSortQuery(filters, filterQuery, isCursorFieldOfText, isSortFieldOfTextType);
    }

    if (filters.dateFilter) {
        filterQuery.query("range", "date", { lte: filters.dateFilter })
    }

    if (filters.cursorValue) {
        filterQuery.rawOption("search_after", getSearchAfterValues(filters));
    }

    return filterQuery.build();
}


const getCursorRange = (filters: GetTableDateFilters): Object => {
    return { [`${filters.cursorOrder === 'asc' ? 'gte' : 'lte'}`]: filters.cursorValue }
}

const getFiledNameForRangeQuery = (filters: GetTableDateFilters, fieldName: keyof GetTableDateFilters, isTextType: boolean): string => {
    return `${filters[fieldName]}${isTextType ? '.keyword' : ''}`;
}


const setSortQuery = (filters: GetTableDateFilters, filterQuery: Bodybuilder, isCursorFieldOfText: boolean, isSortFieldOfTextType: boolean) => {
    // if (filters.cursorValue) {
        filterQuery.sort([
            {[getFiledNameForRangeQuery(filters, "sortFieldName", isSortFieldOfTextType)] : filters.sortOrder || 'desc'},
            {id : 'asc'}
        ]);
    // } else {
    //     filterQuery.sort(getFiledNameForRangeQuery(filters, "sortFieldName", isSortFieldOfTextType), filters.sortOrder || 'desc');
    // }
}

const getSearchAfterValues = (filters: GetTableDateFilters): any[] => {
    let res: (number | string | Date) [] = [+filters.cursorId!];

    if (filters.sortFieldName) {
        res.unshift(filters.cursorValue!)
    }


    return res;
}