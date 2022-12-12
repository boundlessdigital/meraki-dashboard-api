import _ from 'lodash'
import { IOperationDefinition } from './schema.js'
import { write_file } from '../utils.js'


export async function create_operation_types(endpoints: IOperationDefinition[]) {
    let operation_type = 
`import * from './types/index.js'
import { AxiosResponse } from 'axios'

export class Client {\n
`

    for (const endpoint of endpoints) {
        const operation = _.snakeCase(endpoint.operationId)
        operation_type  += `    ${operation}: (params?: object, body?: object) => Promise<AxiosResponse<any, any>>\n`
    }
    operation_type += '}'
    await write_file('lib/meraki/', 'operations.d.ts', operation_type)


}

export async function create_operations(endpoints: IOperationDefinition[]) {
    let operations = 
`import * from './types/index.js'
import { Client } from './client.js'
import { AxiosResponse } from 'axios'
`

    for (const endpoint of endpoints) {
        const operation = _.snakeCase(endpoint.operationId)
        const path_template = endpoint.path.replaceAll('{', '${')
        const path_parameters: string[] = []
        endpoint.parameters?.forEach( (param) => {
            if (param.in === 'path') {
                path_parameters.push(param.name)
            }
        })

        const path_string = path_parameters.map(p => `const ${p} = params.${p}`).join('\n')

        operations += `
Client.prototype.${operation} = function(params, body, query) {

    ${path_string}

    return this.client.request({
        url: \`${path_template}\`,
        params: query,
        method: '${endpoint.method}',
        data: body
    })
}

        `
    }
    operations += '}'
    await write_file('lib/meraki/', 'operations.ts', operations)
}
//   {
//     "name": "organizationId",
//     "in": "path",
//     "type": "string",
//     "required": true
//   },
//   {
//     "type": "array",
//     "items": {
//       "type": "string"
//     },
//     "name": "networkIds",
//     "in": "query",
//     "description": "Filter results by network."
//   },