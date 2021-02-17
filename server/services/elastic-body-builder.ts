import { GetTableDateFilters } from "../../shared/table-data.type";
import bodybuilder from 'bodybuilder';




export const createGetTableDataFilterElasticQuery = (filters?: GetTableDateFilters): any => {
    return bodybuilder().query('multi_match', 'query', "Vickie", { type: "phrase_prefix" })
        .build();

}
