import { PrismaClient } from "@prisma/client"
import { Condition, IntentType } from "../types"
import { MempoolIntent } from "../types/mempool"
import { prisma } from "../prisma"

export class Database {
    private db: PrismaClient
    private ranInitialize: boolean = false
    
    constructor() {
        this.db = prisma
    }

    async registerIntentType(intent: IntentType, mempoolId: string) {
        const intentType = await this.db.intentType.create({
            data: {
                name: intent.name,
                description: intent.description,
                conditions: JSON.stringify(intent.conditions),
                batch: JSON.stringify(intent.batch),
                fee: intent.fee,
                signedOrder: JSON.stringify(intent.signedOrder),
            }
        })

        return intentType
    }

    async addIntent(mempoolIntent: MempoolIntent) {
        const intent = await this.db.mempool.create({
            data: {
                intent: JSON.stringify(mempoolIntent.intent),
                type: {
                    connect: {
                        id: mempoolIntent.id
                    }
                }
            }
        })

        return intent
    }

    async getIntentType(id: string): Promise<IntentType> {
        const intentType = await prisma.intentType.findUniqueOrThrow({
            where: {
                id
            }
        })

        return {
            id: intentType.id,
            name: intentType.name,
            conditions: JSON.parse(intentType.conditions) as Condition[],
            batch: JSON.parse(intentType.batch),
            fee: intentType.fee,
            signedOrder: JSON.parse(intentType.signedOrder)
        } as IntentType
    }

    async getMempoolIntents(): Promise<MempoolIntent[]> {
        const mempoolIntents = await prisma.mempool.findMany()

        const intents: MempoolIntent[] = mempoolIntents.map(intent => {
            return {
                id: intent.id,
                intent: JSON.parse(intent.intent),
                createdAt: new Date(intent.createdAt)
            } as MempoolIntent
        })

        return intents
    }

    async getMempoolIntent(id: string): Promise<MempoolIntent> {
        const intent = await prisma.mempool.findUniqueOrThrow({
            where: {
                id
            }
        })

        return {
            id: intent.id,
            intent: JSON.parse(intent.intent),
            createdAt: new Date(intent.createdAt)
        } as MempoolIntent
    }
}