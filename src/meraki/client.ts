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
}
