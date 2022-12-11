import axios, { Axios } from 'axios'
import { DEFAULT_MERAKI_TIMEOUT } from './settings.js'
import { IClientParams } from '../types/global'

export class Client {
    api_key: string
    host: string
    base_path: string
    client: Axios

    constructor(config: IClientParams) {
        this.api_key = config.api_key
        this.host = config.base_url || 'https://api.meraki.com'
        this.base_path = config.base_path || '/api/v1'
        this.client = axios.create({
            baseURL: this.host + this.base_path,
            timeout: config.timeout || DEFAULT_MERAKI_TIMEOUT,
            headers: {
                'User-Agent':
                    config.user_agent || 'JavascriptSDK BoundlessDigital',
                'X-Cisco-Meraki-API-Key': this.api_key
            }
        })

        // this.client.interceptors.response.use(null, retry(this.client))
    }

    getOrganizations() {
        return this.client.request({
            url: '/organizations',
            method: 'get'
        })
    }
}

// function add_meraki_methods() {
//     // const method = 'get_organizations'
//     Client.prototype.get_organizations = function () {
//         console.log(arguments.callee.caller.name)
//     }
// }

// export const build_client = () => {
//     let operations: OperationList = {}

//     for (const [path, endpoint] of Object.entries(spec.paths)) {
//         for (const [method, operationDescription] of Object.entries(endpoint)) {
//             let operationId: string = operationDescription.operationId
//             let operation = {
//                 method: method.toUpperCase(),
//                 path: path,
//                 parameters: operationDescription.parameters,
//             }
//             operations[operationId] = operation
//         }
//     }

//     return operations
// })()
