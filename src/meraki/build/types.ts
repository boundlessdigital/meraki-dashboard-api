import toJsonSchema from 'to-json-schema'
import { compile, JSONSchema } from 'json-schema-to-typescript'
import { write_file } from '../utils.js'
import { MERAKI_API_TYPES_DIR } from '../../settings.js'
import _ from 'lodash'



async function write_type_definition(name: string, content: string) {
    const filename = `${name}.d.ts`
    await write_file(MERAKI_API_TYPES_DIR, filename, content)
}


async function generate_typedef(schema: toJsonSchema.JSONSchema3or4) {
    const type_def = await compile(schema as JSONSchema, schema['title'] as string)
    return type_def
}



export async function create_types(schemas: toJsonSchema.JSONSchema3or4[]) {
    for (const schema of schemas) {
        const type_def = await generate_typedef(schema)
        const name = `I${_.upperFirst(schema.title)}`
        await write_type_definition(name, type_def)
    }
}