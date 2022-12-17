import toJsonSchema from 'to-json-schema'
import _ from 'lodash'
import { MERAKI_API_SCHEMA_DIR } from '../../settings.js'
import { BuildException, write_file, has_own_property, debug_log } from '../utils.js'



type HttpMethod = 'get' | 'delete' | 'options' | 'head' | 'put' | 'post'
export interface IParameter {
    name: string  
    in: 'path'  | 'body' | 'query'
    type: 'string' | 'object'
    required?: boolean
    schema: {
        type: string
        properties: object
        example?: object
        required: string[]
    }
}

export interface IOperationDefinition {
    path: string
    method: HttpMethod
    description: string
    operationId: string
    parameters: IParameter[]
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


async function generate_request_body_schema(definition: IOperationDefinition) {
    const parameters = definition.parameters
    const body_parameter = _.find(parameters, { in: 'body'})
    if (body_parameter) {
        const schema_def = body_parameter.schema
        delete body_parameter.schema.example
        const schema = toJsonSchema(schema_def)
        schema.title = `${definition.operationId}RequestBody`
        schema['$schema'] = 'http://json-schema.org/draft-04/schema#'
        return schema
    
    }

    return null
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
        schema.title = `${definition.operationId}Response`
        return schema
    }

    throw new BuildException('No success response', definition)
}


async function write_schema_file(schema: toJsonSchema.JSONSchema3or4 ) {
    if (schema) {
        const filename = `${schema.title}.schema.json`
        const content = JSON.stringify(schema, null, 4)
        await write_file(MERAKI_API_SCHEMA_DIR, filename, content)
    }
}


export async function create_schemas(endpoint_list: IOperationDefinition[]) {
    const schemas = []

    for (const endpoint of endpoint_list) {
  
        const request_body_schema = await generate_request_body_schema(endpoint) as toJsonSchema.JSONSchema3or4 
        const response_schema = await generate_response_schema(endpoint) as toJsonSchema.JSONSchema3or4 
        await write_schema_file(request_body_schema)
        await write_schema_file(response_schema)

        if (request_body_schema) {
            schemas.push(request_body_schema)
        }

        if (response_schema) {
            schemas.push(response_schema)
        }
    }
    return schemas
}