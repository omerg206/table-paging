import bodybuilder, { Bodybuilder } from 'bodybuilder';
import { GetTableDateFilters, SortDirection, NextOrPrevPage } from '../../../shared/table-data.type';

export const createGetTableDataFilterElasticQuery = (filters: GetTableDateFilters, isSortFieldOfTextType: boolean): any => {
    let filterQuery = bodybuilder().size(+filters.pageSize);


    if (filters.textFilter != null && filters.textFilter !== '') {
        filterQuery.query('multi_match', 'query', filters.textFilter, {
            "fields": [], "operator": "and", "analyzer": "my_analyzer"
        })
    }

    if (filters.sortFieldName) {
        setSortQuery(filters, filterQuery, isSortFieldOfTextType);
    }

    if (filters.dateStartFilter) {
        filterQuery.query("range", filters.dateKey, { gte: convertDateToMilliSec(filters.dateStartFilter) })
    }

    if (filters.dateEndFilter) {
        filterQuery.query("range", filters.dateKey, { lte: convertDateToMilliSec(filters.dateEndFilter) })
    }

    if (filters.sortValue) {
        filterQuery.rawOption("search_after", getSearchAfterValues(filters));
    }

    return filterQuery.build();
}




const getFiledNameForRangeQuery = (filters: GetTableDateFilters, isTextType: boolean): string => {
    return `${filters.sortFieldName}${isTextType ? '.keyword' : ''}`;
}


const setSortQuery = (filters: GetTableDateFilters, filterQuery: Bodybuilder, isSortFieldOfTextType: boolean) => {
    let idFieldDirection: SortDirection = 'asc'
    if (filters.sortFieldName !== filters.idKey) {

        filterQuery.sort(
            getFiledNameForRangeQuery(filters, isSortFieldOfTextType), getSortDirection(filters.sortOrder, filters.nextOrPreviousPage));
    } else {
        idFieldDirection = filters.sortOrder
    }

    filterQuery.sort(filters.idKey, getSortDirection(idFieldDirection, filters.nextOrPreviousPage));

}


const getSortDirection = (currentDirection: SortDirection, nextOrPreviousPage: NextOrPrevPage): SortDirection => {
    return nextOrPreviousPage === 'previousPage' ? changeSortDirection(currentDirection) : currentDirection;
}

const changeSortDirection = (currentDirection: SortDirection): SortDirection => {
    return currentDirection === 'asc' ? 'desc' : 'asc';
}


const getSearchAfterValues = (filters: GetTableDateFilters): any[] => {
    let res: (number | string | Date)[] = [+filters.sortId!];

    if (filters.sortFieldName !== filters.idKey) {
        const sortValue = filters.sortFieldName === filters.dateKey ? convertDateToMilliSec(filters.sortValue) : filters.sortValue;
        res.unshift(sortValue!)
    }


    return res;
}

const convertDateToMilliSec = (date: Date | string | number | undefined | null): number | null => {
    return date ? new Date(date as string).getTime() : null;
}