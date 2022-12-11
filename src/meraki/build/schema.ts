import toJsonSchema from 'to-json-schema'
import _ from 'lodash'
import { MERAKI_API_SCHEMA_DIR } from '../../settings.js'
import { BuildException, write_file, has_own_property } from '../utils.js'



type HttpMethod = 'get' | 'delete' | 'options' | 'head' | 'put' | 'post'
export interface IOperationDefinition {
    path: string
    method: HttpMethod
    description: string
    operationId: string
    responses: {
        [status_code: string]: object
    }
    summary: string
    tags: string
}

interface ISchemaCandidate {
    schema?: {
        types: string
        title: string
    }
    description: string,
    examples: {
        'application/json': object
    }
}

function has_schema_definition(response: ISchemaCandidate) {
    const schema = response.schema

    if (schema?.types === 'object' && has_own_property(schema, 'properties')) {
        return true
    }

    return false
}

function has_example(response: ISchemaCandidate) {
    return has_own_property(response, 'examples')
}

function schema_from_example(response: ISchemaCandidate) {
    const example = response.examples['application/json']
    return toJsonSchema(example)
}

async function generate_response_schema(definition: IOperationDefinition) {
    const successful_response_codes = ['200', '201', '202', '204']
    const success_response_code = _.find(
        _.keys(definition.responses),
        (key: string) => successful_response_codes.includes(key)
    )

    if (!success_response_code) {
        throw new BuildException('No success response', definition)
    }

    const success = definition.responses[success_response_code] as ISchemaCandidate

    let schema
    if (has_schema_definition(success)) {
        schema = success.schema
    } else if (has_example(success)) {
        schema = schema_from_example(success)
    } else if (success.description) {
        schema = toJsonSchema(success)
    }

    if (schema) {
        schema.title = `I${_.upperFirst(definition.operationId)}Response`
        return schema
    }

    throw new BuildException('No success response', definition)
}


async function write_schema_file(name: string, schema: toJsonSchema.JSONSchema3or4 ) {
    const filename = `${name}.schema.json`
    const content = JSON.stringify(schema, null, 4)
    await write_file(MERAKI_API_SCHEMA_DIR, filename, content)
}


export async function create_schema(definition: IOperationDefinition) {
    const schema = await generate_response_schema(definition) as toJsonSchema.JSONSchema3or4 
    await write_schema_file(definition.operationId, schema)
    return schema
}