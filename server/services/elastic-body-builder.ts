import { GetTableDateFilters } from "../../shared/table-data.type";
import bodybuilder, { Bodybuilder } from 'bodybuilder';

export const createGetTableDataFilterElasticQuery = (filters: GetTableDateFilters, isSortFieldOfTextType: boolean): any => {
    let filterQuery = bodybuilder().size(+filters.pageSize);


    if (filters.textFilter) {
        filterQuery.query('multi_match', 'query', filters.textFilter, {
            "fields": [], "operator": "and", "analyzer": "my_analyzer"
        })
    }

    if (filters.sortFieldName) {
        setSortQuery(filters, filterQuery, isSortFieldOfTextType);
    }

    if (filters.dateFilter) {
        filterQuery.query("range", "date", { lte: filters.dateFilter })
    }

    if (filters.sortValue) {
        filterQuery.rawOption("search_after", getSearchAfterValues(filters));
    }

    return filterQuery.build();
}


const getFiledNameForRangeQuery = (filters: GetTableDateFilters, fieldName: keyof GetTableDateFilters, isTextType: boolean): string => {
    return `${filters[fieldName]}${isTextType ? '.keyword' : ''}`;
}


const setSortQuery = (filters: GetTableDateFilters, filterQuery: Bodybuilder, isSortFieldOfTextType: boolean) => {
    let idFieldDirection: 'asc' | 'desc' = 'asc'
    if (filters.sortFieldName !== filters.idKey) {
        filterQuery.sort(
            getFiledNameForRangeQuery(filters, "sortFieldName", isSortFieldOfTextType), getSortDirection(filters.sortOrder, filters.nextOrPreviousPage));
    } else {
        idFieldDirection = filters.sortOrder
    }

    filterQuery.sort(filters.idKey, getSortDirection(idFieldDirection, filters.nextOrPreviousPage));

}


const getSortDirection = (currentDirection: 'asc' | 'desc', nextOrPreviousPage: 'nextPage' | 'previousPage'): 'asc' | 'desc' => {
    return nextOrPreviousPage === 'previousPage' ? changeSortDirection(currentDirection) : currentDirection;
}

const changeSortDirection = (currentDirection: 'asc' | 'desc'): 'asc' | 'desc' => {
    return currentDirection === 'asc' ? 'desc' : 'asc';
}


const getSearchAfterValues = (filters: GetTableDateFilters): any[] => {
    let res: (number | string | Date)[] = [+filters.sortId!];

    if (filters.sortFieldName !== filters.idKey) {
        res.unshift(filters.sortValue!)
    }


    return res;
}