import { GetTableDateFilters } from "../../shared/table-data.type";
import bodybuilder from 'bodybuilder';




export const createGetTableDataFilterElasticQuery = (filters: GetTableDateFilters): any => {
    let filterQuery = bodybuilder().size(filters.pageSize || 10);


    if (filters.textFilter) {
        filterQuery = filterQuery.query('multi_match', 'query', filters.textFilter, {
            "fields": ["test"], "operator": "and", "analyzer": "my_analyzer"
        })
    }

    if (filters.sortFieldName) {
        filterQuery = filterQuery.sort('email', filters.sortOrder || 'desc')
    }

    if (filters.dateFilter) {
        filterQuery.query("range", "date", { lte: filters.dateFilter })
    }



    return filterQuery.build();
}
