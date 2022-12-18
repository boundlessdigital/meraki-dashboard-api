import axios, { Axios, AxiosResponse } from 'axios'
import { DEFAULT_MERAKI_TIMEOUT } from '../settings.js'
import { IClientParams } from '../types/global'

export interface IClientOperation {
    // [method: string]: () => Promise<AxiosResponse<any, any>>
}

export interface IClientProperties {
    api_key: string
    host: string
    base_path: string
    client: Axios
}

export type IClient = IClientProperties & IClientOperation

export class Client implements IClient {
    api_key: string;
    host: string;
    base_path: string;
    client: Axios;

    constructor(config: IClientParams) {
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
}

interface IOperation {
    operation_id: string
    method: string
    path: string
}
