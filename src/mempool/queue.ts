import amqplib from "amqplib"
import { QUEUE_NAME, RABBITMQ_URI } from "../types"

export const publishIntent = async (intent: any) => {
    const conn = await amqplib.connect(RABBITMQ_URI)

    const ch1 = await conn.createChannel()
    await ch1.assertQueue(intent.id)

    return ch1.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(intent)))
}