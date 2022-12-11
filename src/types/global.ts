// export {}
declare module 'to-json-schema'

// declare global {
//     // namespace NodeJS {
//     //     interface ProcessEnv {
//     //         MERAKI_DASHBOARD_API: string
//     //         ENV: 'test' | 'dev' | 'prod'
//     //     }
//     // }

//     export interface IMeraki {
//         api_key: string
//         base_url?: string
//         base_path?: string
//         user_agent?: string
//         timeout?: number
//     }

//     export interface IClientParams {
//         api_key: string
//         base_url?: string
//         base_path?: string
//         user_agent?: string
//         timeout?: number
//     }

//     export interface OperationList {
//         [operationId: string]: {
//             method: string
//             path: string
//             parameters: object
//         }
//     }

//     class Client {
//         get_organizations: () => void
//     }
// }

export interface IMeraki {
    api_key: string
    base_url?: string
    base_path?: string
    user_agent?: string
    timeout?: number
}

export interface IClientParams {
    api_key: string
    base_url?: string
    base_path?: string
    user_agent?: string
    timeout?: number
}
