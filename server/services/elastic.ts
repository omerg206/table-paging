import { GetTableDateFilters, ServerGetTableDataReposes } from './../../shared/table-data.type';
import elasticsearch, { SearchResponse } from 'elasticsearch';
import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { TableData } from '../../shared/table-data.type';
import { createGetTableDataFilterElasticQuery } from './elastic-body-builder';
import { reduce } from 'lodash';


const index = "table-data"
const client = new elasticsearch.Client({
    host: 'localhost:9200',
    log: 'error',
    apiVersion: '6.8', // use the same version of your Elasticsearch instance
});


export const getTableData = async (req: Request, res: Response) => {
    try {
        const sortParams: GetTableDateFilters = JSON.parse(req.query.filters as string);
        const isSortFieldOfText = await isFieldOfTextType(sortParams, "sortFieldName");
        const isCursorFieldOfText = await isFieldOfTextType(sortParams, "cursorFiledName");
        const  elasticData  = await getDataFromElastic(sortParams, isCursorFieldOfText, isSortFieldOfText);

        const response : ServerGetTableDataReposes = {
            payload: { data: convertElasticDocToTableData(elasticData), totalResultCount: elasticData.hits.total }
        }
        return res.status(200).json(response);
    } catch (e) {
        return res.status(503).json({ error: `elastic error ${e}` });
    }
}

const convertElasticDocToTableData = (rawData: elasticsearch.SearchResponse<unknown>): TableData[] => {
    return rawData.hits.hits.map(element => element._source as TableData);

}


const getDataFromElastic = async (sortFilters: GetTableDateFilters, isCursorFieldOfText: boolean = false, isSortFieldOfTextType: boolean = false): Promise<elasticsearch.SearchResponse<unknown>> => {
    try {
        const query: any = createGetTableDataFilterElasticQuery(sortFilters, isCursorFieldOfText, isSortFieldOfTextType);
        return await client.search({ index, body: query });
    } catch (e) {
        console.error(e);
        throw e
    }
}

export const insertMockToElastic = async () => {
    try {
        await createIndex();
        const isIndexEmpty = await client.indices.stats({ index }).then((res) => res.indices[index].total.docs.count === 0);

        if (isIndexEmpty) {
            const data = fs.readFileSync(path.join(__dirname, "../utils/mock-data.json"))
            const parsedData: TableData[] = JSON.parse(data.toString());

            const body = parsedData.reduce((acc: any, ele: TableData) => {
                acc.push({ index: { _index: index, _type: '_doc', _id: ele.id } }, ele);

                return acc;
            }, [])

            const res = await client.bulk({
                body,
                index
            });
            console.log(res);
        }

    } catch (e) {
        console.error(e);
    }

}

const isFieldOfTextType = async (sortParams: GetTableDateFilters, fieldName: "sortFieldName" | "cursorFiledName"): Promise<boolean> => {
    try {
        const filedValue = sortParams[fieldName]
        const mapping = await client.indices.getMapping({ index })
        return (filedValue && mapping[index].mappings._doc.properties[filedValue].type === 'text') as boolean;
    } catch (e) {
        throw e
    }
};


const deleteIndex = async () => {
    const isIndexExists = await client.indices.exists({ index });

    if (isIndexExists) {
        client.indices.delete({ index });
    }
}
const createIndex = async () => {
    const isIndexExists = await client.indices.exists({ index });

    if (!isIndexExists) {
        const rawSetting = fs.readFileSync(path.join(__dirname, "../utils/settings.json"));
        const parsedSetting: any[] = JSON.parse(rawSetting.toString());

        const rawMapping = fs.readFileSync(path.join(__dirname, "../utils/mapping.json"));
        const parsedMapping: any[] = JSON.parse(rawMapping.toString());

        await client.indices.create({
            index, body: {
                settings: parsedSetting,
                mappings: parsedMapping
            }
        });
    }
}