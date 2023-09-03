import amqplib from "amqplib"
import { QUEUE_NAME, RABBITMQ_URI } from "../types"
import { Mempool } from "@prisma/client"
import { solveCrossChain } from "./solver"
import { prisma } from "../prisma"
import { validateIntentType } from "../utils"

export const listenIntents = async () => {
    const conn = await amqplib.connect(RABBITMQ_URI)

    const crossChainIntentQueue = "cross-chain-intenet"
    const ch1 = await conn.createChannel()
    await ch1.assertQueue(crossChainIntentQueue)

    console.log("listening")

    ch1.consume(crossChainIntentQueue, async (msg) => {
        const intent = JSON.parse(msg!.content.toString()) as Mempool
        validateIntentType(intent)

        if(intent.id.toLowerCase() !== crossChainIntentQueue.toLowerCase()) throw new Error("intent type doesn't match")

        try {
            const txs = await solveCrossChain(intent)
    
            await prisma.mempool.update({
                where: {
                    id: intent.id
                },
                data: {
                    solved: true,
                    approved: true,
                    response: JSON.stringify(txs)
                }
            })
        } catch (e) {
            console.log("failed")

            await prisma.mempool.update({
                where: {
                    id: intent.id,
                },
                data: {
                    solved: false,
                    approved: true
                }
            })
        }
    })

    const cowSwapIntent = "cow-swap-intent"
    const cowSwapChannel = await conn.createChannel()
    cowSwapChannel.assertQueue(cowSwapIntent)

    cowSwapChannel.consume(cowSwapIntent, async (msg) => {
        const intent = JSON.parse(msg!.content.toString()) as Mempool
        validateIntentType(intent)

        if(intent.id.toLowerCase() !== cowSwapIntent.toLowerCase()) throw new Error("intent type doesn't match")
    })
}