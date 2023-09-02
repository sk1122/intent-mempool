import amqplib from "amqplib"
import { QUEUE_NAME, RABBITMQ_URI } from "../types"
import { Mempool } from "@prisma/client"
import { solve } from "./solver"

export const listenIntents = async () => {
    const conn = await amqplib.connect(RABBITMQ_URI)

    const ch1 = await conn.createChannel()
    await ch1.assertQueue(QUEUE_NAME)

    ch1.consume(QUEUE_NAME, (msg) => {
        const intent = JSON.parse(msg!.content.toString()) as Mempool

        solve(intent)
    })
}