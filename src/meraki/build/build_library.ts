import path from 'path'
import { save_spec } from './spec.js'
import { debug_log, BuildException } from '../utils.js'
import { OpenAPIV2 } from 'openapi-types'
import { mkdir } from 'node:fs/promises'
import { create_schemas, IOperationDefinition } from './schema.js'
import { create_types } from './types.js'


import {
    MERAKI_LIB_DIRECTORY,
    MERAKI_API_SCHEMA_DIR,
    MERAKI_API_TYPES_DIR
} from '../../settings.js'

type HttpMethod = 'get' | 'delete' | 'options' | 'head' | 'put' | 'post'


async function initialize() {
    await mkdir(path.resolve(MERAKI_LIB_DIRECTORY), { recursive: true })
    await mkdir(path.resolve(MERAKI_API_SCHEMA_DIR), { recursive: true })
    await mkdir(path.resolve(MERAKI_API_TYPES_DIR), { recursive: true })
    

    const spec = save_spec()
    return spec
}

function build_endpoints_list(spec: OpenAPIV2.Document) {
    const endpoint_list: IOperationDefinition[] = []

    for (const [path, endpoint] of Object.entries(spec.paths)) {
        for (const [method, definition] of Object.entries(endpoint)) {
            const operationDefinition: Pick<IOperationDefinition, 'path' | 'method'> = {
                path,
                method: method as HttpMethod,
                ...(definition as object)
            }

            endpoint_list.push(operationDefinition as IOperationDefinition)
        }
    }

    return endpoint_list
}


async function main()  {
    try {
        const spec = await initialize()
        const endpoint_list: IOperationDefinition[] = build_endpoints_list(spec)

        const schemas = await create_schemas(endpoint_list)
        await create_types(schemas)
    } catch (error) {
        if (error instanceof BuildException) {
            console.log(error.message)
            debug_log(JSON.stringify(error.payload))
        }
        console.log('Had an error')
        console.log(error)
    }
}

await main()