const util = require('util');
const exec = util.promisify(require('child_process').exec);
const fs = require('fs');
const promisify = require('util').promisify;
const deleteFile = promisify(fs.unlink);


import { forEach } from 'lodash';

export interface CreateElasticDumpCommandParams {
    index: string;
    input: string; //source elastic address
    output: string; //file path or another elastic address
    outputIndex?: string; //if null output should be a file path
    delete?: boolean; //delete docs 
    dumpTypes?: ElasticdumpOptions[]; //for multiple types, if null then only data is copied
}


type ElasticDumpType = 'data' | 'mapping' | 'settings' | 'analyzer' | 'alias' | 'template' | 'component_template' | 'index_template';

interface ElasticdumpOptions {
    type: ElasticDumpType
    overwrite?: boolean;
    bulk?: boolean;
    limit?: number;
    searchBody?: any;
    delete?: boolean
}




export async function elasticdump(params: CreateElasticDumpCommandParams) {
    const inputWithIndex = addAddressToInputOrOutput(params.input, params.index);
    const outputWithIndex = addAddressToInputOrOutput(params.output, params.outputIndex);

    try {
        const elasticDumpCommandString = createElasticDumpCommand({ ...params, input: inputWithIndex, output: outputWithIndex });
        console.log('starting elastic dump', elasticDumpCommandString);

        const { stdout, stderr } = await exec(elasticDumpCommandString);

        if (stderr) {
            throw (stderr)
        }

        console.log(stdout);

        if (params.delete) {
            deleteIndexOrFile(inputWithIndex);
        }

    } catch (e) {
        console.log(e);
        onErrorDeleteOutput(e, outputWithIndex, params.outputIndex)
    }
}

function onErrorDeleteOutput({ stderr }: { stderr: string }, outputWithIndex: string, outputIndex?: string) {
    if (!stderr.includes("already exists")) {
        const isFile = outputIndex == null;
        deleteIndexOrFile(outputWithIndex, isFile);
    }

}

function addOptions(options: ElasticdumpOptions): string {
    let res = ``;

    forEach(options, (val: any, key: string) => {
        res += ` ` + transformArgToElasticDumpString((key as keyof ElasticdumpOptions), val);
    })

    return res;
}

function transformArgToElasticDumpString(argKey: keyof ElasticdumpOptions | 'input' | 'output', argVal: any): string {
    const processedArgVal = argKey === 'searchBody' ? dumpSearchQuery(argVal) : argVal;
    return `--${argKey}=${processedArgVal}`;
}



function createElasticDumpCommand({ input, output, dumpTypes = [{ type: 'data' }] }: CreateElasticDumpCommandParams): string {
    let dumpCommand = ``
    dumpTypes.forEach((dumpType: ElasticdumpOptions, index: number) => {
        dumpCommand += `${index === 0 ? '' : '&&'}elasticdump ` + transformArgToElasticDumpString('input', input) +
            ' ' + transformArgToElasticDumpString('output', output) + ' ' + addOptions(dumpType) + ' /'
    })

    return dumpCommand
}

function addAddressToInputOrOutput(inputOrOutput: string, index?: string) {
    let res = inputOrOutput;
    if (index) {
        res = inputOrOutput.split(/\/{1}$/)[0] + `/${index}`; //remove trailing / if there is one
    }

    return res;

}

async function deleteIndexOrFile(inputOrOutPutWithIndex: string, isFile?: boolean) {
    try {
        if (isFile) {
            await deleteFile(inputOrOutPutWithIndex);
        } else {
            const { stdout, stderr } = await exec(`curl -X DELETE "${inputOrOutPutWithIndex}?pretty`);
            if (stderr) {
                throw (stderr)
            }
        }

        console.log(`deleted data from ${inputOrOutPutWithIndex}`)
    } catch (e) {
        console.log(e);
    }

}

//queries only
function dumpSearchQuery(searchQuery: object): string {
    return JSON.stringify(searchQuery).replace(/\"/g, '\\\"');

}

