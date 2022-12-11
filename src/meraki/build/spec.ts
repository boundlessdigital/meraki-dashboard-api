import fs from 'fs'
import axios from 'axios'
import { OpenAPIV2 } from 'openapi-types'
import { MERAKI_API_SPEC_FILE_PATH, MERAKI_API_SPEC_URL } from '../../settings.js'


export async function fetch_latest_meraki_spec() {
    return await axios.get(MERAKI_API_SPEC_URL)
}

export async function save_spec(spec?: OpenAPIV2.Document) {
    if (!spec) {
        const response = await fetch_latest_meraki_spec()
        spec = response.data
    }

    fs.writeFileSync(MERAKI_API_SPEC_FILE_PATH, JSON.stringify(spec))
    return spec as OpenAPIV2.Document
}