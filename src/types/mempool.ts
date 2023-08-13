import { IntentType } from "./intent-type";

export interface MempoolIntent {
    id: string
    intent: IntentType
    createdAt: Date
}

export type Mempool = MempoolIntent[]