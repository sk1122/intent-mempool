import { WebSocket } from "ws"

export const QUEUE_NAME = "intents"

export const WS_PORT = 2245

export const RABBITMQ_URI = "amqp://localhost"

export interface WebsocketClientData {
    types: string[]
    clientId: string
    ws: WebSocket
}