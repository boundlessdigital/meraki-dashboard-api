import { compile } from 'json-schema-to-typescript'



async function write_type_definition(name: string, content: string) {
    const filename = `${name}.d.ts`
    await write_file(MERAKI_API_TYPES_DIR, filename, content)
}


async function generate_typedef(schema: object, operationId: string) {
    const type_def = await compile(schema, schema['title'])
    return type_def
}

async function build_library_asset(definition: IOperationDefinition) {
    const schema = await generate_response_schema(definition)
    const type_def = await generate_typedef(schema, name)

    await write_type_definition(schema.title, type_def)
}


