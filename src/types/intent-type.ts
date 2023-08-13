import { Condition } from "./conditions"

export interface IntentType {
    id: string
    name: string
    description: string
    conditions: Condition[]
    batch?: {
        enabled: boolean
        interval: number
    },
    fee: number // in wei (18 decimals)
    signedOrder: {
        signature: string
        scheme: string
    }
}