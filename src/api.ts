import express, { Express, NextFunction, Request, Response } from "express"
import { prisma } from "./prisma"
import { IntentType, Mempool } from "@prisma/client"
import { publishIntent } from "./mempool"

export class API {
    private server: Express

    constructor() {
        const server = express()

        server.use(express.json())

        server.get("/read-intents", this.readIntents)
        server.post("/publish-intent", this.publishIntent)
        server.get("/solved-intent", this.solvedIntent)
        server.post("/publish-intent-type", this.publishIntentType)

        server.use((err: any, req: Request, res: Response, next: NextFunction) => {
            res.status(400).send({
                status: 400,
                error: `${err.name ?? "UnexpectedError"} - ${err.message ?? "Something unexpected happened"}`,
                timestamp: new Date()
            })
        })
        

        this.server = server
    }

    public runServer(port: number) {
        this.server.listen(port, () => {
            console.log(`Listening on port ${port}`)
        })
    }
    
    private async readIntents(req: Request, res: Response, next: NextFunction) {
        try {
            const intents = await prisma.mempool.findMany()

            res.status(200).send({
                status: 200,
                data: intents,
                timestamp: new Date()
            })
        } catch (e) {
            next(e)
        }
    }

    private async publishIntentType(req: Request<{}, {}, IntentType>, res: Response, next: NextFunction) {
        try {
            const body = req.body

            const intentType = await prisma.intentType.create({
                data: body
            })

            res.status(200).send({
                status: 200,
                data: intentType,
                timestamp: new Date()
            })
        } catch (e) {
            next(e)
        }
    }

    private async publishIntent(req: Request<{}, {}, Mempool>, res: Response, next: NextFunction) {
        try {
            const body = req.body

            const intent = await prisma.mempool.create({
                data: body
            })

            await publishIntent(intent)

            res.status(200).send({
                status: 200,
                data: intent,
                timestamp: new Date()
            })
        } catch (e) {
            next(e)
        }
    }

    private async solvedIntent(req: Request, res: Response, next: NextFunction) {
        try {
            const {
                id
            } = req.query

            let intents: any

            if(id) {
                intents = [
                    await prisma.mempool.findUniqueOrThrow({
                        where: {
                            id: id as string
                        }
                    })
                ]
            }

            intents = await prisma.mempool.findMany({
                where: {
                    solved: true
                }
            })

            res.status(200).send({
                status: 200,
                data: intents,
                timestamp: new Date()
            })
        } catch (e) {
            next(e)
        }
    }
}