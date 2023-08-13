import { Database } from "../db"
import express from "express"
import { Server } from "./server"
import { IntentType } from "../types"
import { MempoolIntent } from "../types/mempool"

export class Mempool {
    private db: Database
    private server: Server

    constructor() {
        this.db = new Database()
        this.server = new Server()
    }

    async runServer() {
        this.server.listen(Number(process.env.PORT), () => {
            console.log(`server is running at ${process.env.PORT}`)
        })
    }

    async registerIntentType(intent: IntentType) {
        return this.db.registerIntentType(intent)
    }

    async addIntent(intent: MempoolIntent) {
        // register pre-conditions as publisher
        // approve intent after all pre-conditions are met
        // once approved, use batch conditions

        return this.db.addIntent(intent)
    }

    async getIntentType(id: string) {
        return this.db.getIntentType(id)
    }

    async getMempoolIntent(id: string) {
        return this.db.getMempoolIntent(id)
    }

    async getMempoolIntents() {
        return this.db.getMempoolIntents()
    }
}