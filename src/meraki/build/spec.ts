import fs from 'fs'
import axios from 'axios'
import { OpenAPIV2 } from 'openapi-types'
import { MERAKI_LIB_DIRECTORY, MERAKI_API_SPEC_URL } from '../../settings.js'
import { write_file } from '../utils.js'


export async function fetch_latest_meraki_spec() {
    return await axios.get(MERAKI_API_SPEC_URL)
}

export async function save_spec(spec?: OpenAPIV2.Document) {
    if (!spec) {
        const response = await fetch_latest_meraki_spec()
        spec = response.data
    }

    write_file(MERAKI_LIB_DIRECTORY, 'spec.json', JSON.stringify(spec, null, 4))
    return spec as OpenAPIV2.Document
}