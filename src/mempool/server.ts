import { WebSocketServer } from "ws";
import { WS_PORT } from "../config";
import { uuid } from "uuidv4";
import { WebsocketClientData } from "../types";
import { IntentType } from "@prisma/client";

export class Websocket {
    public subscribedTypes: { [key: string]: WebsocketClientData }
    public clients: any

    constructor() {
        this.clients = {}
        this.subscribedTypes = {}
    }

    public runServer() {
        console.log("running server")

        const wss = new WebSocketServer({
            port: WS_PORT
        })
        
        wss.on("connection", (ws) => {
            const id = uuid()
            this.clients[id] = true
            console.log(this.clients)
            
            ws.on('error', console.error)
        
            ws.on('message', (data: Buffer) => {
                const clientId = uuid()
        
                let parsedData = JSON.parse(data.toString()) as WebsocketClientData
                parsedData.clientId = id
                parsedData.ws = ws
        
                this.subscribedTypes[clientId] = parsedData
        
                console.log(this.subscribedTypes)
            })
        
            ws.on("close", (code, reason) => {
                this.clients[id] = false
                
                const keys = Object.keys(this.subscribedTypes)
                for(let i = 0; i < keys.length; i++) {
                    console.log(keys[i])
                    if(this.subscribedTypes[keys[i]].clientId === id) {
                        delete this.subscribedTypes[keys[i]]
                    }
                }
        
                delete this.clients[id]
        
                console.log(this.clients)
            })
        })
    }

    public sendToWebsocket = async (data: IntentType, jobId: string) => {
        const keys = Object.keys(this.subscribedTypes)
    
        let found = false

        for(let i = 0; i < keys.length; i++) {
            const subscribedType = this.subscribedTypes[keys[i]]
    
            if(subscribedType.types.includes(data.id)) {
                subscribedType.ws.send(Buffer.from(JSON.stringify(data)))
                found = true
            }
        }
    
        return found
    }
}