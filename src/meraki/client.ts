import axios, { Axios, AxiosResponse } from 'axios'
import { DEFAULT_MERAKI_TIMEOUT } from '../settings.js'
import { IClientParams } from '../types/global'

export interface IClientOperation {
    [method: string]: () => Promise<AxiosResponse<any, any>>
}

export interface IClientProperties {
    api_key: string
    host: string
    base_path: string
    client: Axios
}

export type IClient = IClientProperties & IClientOperation

export function Client(this: IClient, config: IClientParams) {
    this.api_key = config.api_key
    this.host = config.base_url || 'https://api.meraki.com'
    this.base_path = config.base_path || '/api/v1'
    this.client = axios.create({
        baseURL: this.host + this.base_path,
        timeout: config.timeout || DEFAULT_MERAKI_TIMEOUT,
        headers: {
            'User-Agent': config.user_agent || 'JavascriptSDK BoundlessDigital',
            'X-Cisco-Meraki-API-Key': this.api_key
        }
    })
}

interface IOperation {
    operation_id: string
    method: string
    path: string
}

function add_operation_to_client(operation: IOperation) {
    Client.prototype[operation.operation_id] = function () {
        return this.client.request({
            url: operation.path,
            method: operation.method
        })
    }
}

const operations = [
    {
        operation_id: 'getOrganizations',
        method: 'get',
        path: '/organizations'
    },
    {
        operation_id: 'getAdministeredIdentitiesMe',
        method: 'get',
        path: '/administered/identities/me'
    }
]

operations.forEach((operation) => add_operation_to_client(operation))

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
