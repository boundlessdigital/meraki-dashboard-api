import toJsonSchema from 'to-json-schema'
import { compile, JSONSchema } from 'json-schema-to-typescript'
import { write_file } from '../utils.js'
import { MERAKI_API_TYPES_DIR } from '../../settings.js'
import { IOperationDefinition} from './schema.js'
import _ from 'lodash'



async function write_type_definition(name: string, content: string) {
    const filename = `${name}.ts`
    await write_file(MERAKI_API_TYPES_DIR, filename, content)
}


async function generate_typedef(schema: toJsonSchema.JSONSchema3or4) {
    const type_def = await compile(schema as JSONSchema, schema['title'] as string)
    return type_def
}


async function create_type_index(type_references: string[]) {
    const content = type_references.join('\n')
    await write_file('lib/meraki/types', 'index.ts', content)
}



export async function create_types(schemas: toJsonSchema.JSONSchema3or4[]) {
    const type_references = []
    for (const schema of schemas) {
        const type_def = await generate_typedef(schema)
        const name = `I${_.upperFirst(schema.title)}`
        await write_type_definition(name, type_def)
        type_references.push(`export * from './${name}.js'`)
    }
    await create_type_index(type_references)
}