import { GetTableDateFilters } from './../../shared/table-data.type';
import elasticsearch from 'elasticsearch';
import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { TableData } from '../../shared/table-data.type';
import { createGetTableDataFilterElasticQuery } from './elastic-body-builder';

const index = "table-data"
const client = new elasticsearch.Client({
    host: 'localhost:9200',
    log: 'error',
    apiVersion: '6.8', // use the same version of your Elasticsearch instance
});


export const getTableData = (req: Request, res: Response) => {
    const queryParams = req.query;

    const sortParams: GetTableDateFilters = {
        dateFilter: queryParams?.dateFilter as any,
        sortOrder: queryParams?.sortOrder as 'desc' | 'asc',
        sortFieldName: queryParams?.sortFieldName as keyof TableData,
        textFilter: queryParams?.textFilter as string,
        pageNumber: queryParams?.pageNumber as any,
        pageSize: queryParams?.pageSize as any

    }

    return res.status(200).json({ payload: [] });
}



const getDataFromElastic = async () => {
    try {
        const query: any = createGetTableDataFilterElasticQuery();
        const { hits: res } = await client.search({
            index, body: { ...query }
        });

    } catch (e) {
        console.error(e);

    }


}

export const insertMockToElastic = async () => {

    try {
        const isIndexExists = await client.indices.exists({ index });

        if (isIndexExists) {

            client.indices.delete({ index });
        }


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
        getDataFromElastic();
    } catch (e) {
        console.error(e);
    }

}