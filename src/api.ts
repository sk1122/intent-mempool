import express, { Express, Request, Response } from "express"
import { prisma } from "./prisma"
import { Mempool } from "@prisma/client"
import { solve } from "./solver"
import { publishIntent } from "./mempool"

export class API {
    private server: Express

    constructor() {
        const server = express()

        server.get("/read-intents", this.readIntents)
        server.post("publish-intent", this.publishIntent)
        server.get("/solved-intent", this.solvedIntent)

        this.server = server
    }

    public runServer(port: number) {
        this.server.listen(port, () => {
            console.log(`Listening on port ${port}`)
        })
    }
    
    private async readIntents(req: Request, res: Response) {
        try {
            const intents = await prisma.mempool.findMany()

            res.status(200).send({
                status: 200,
                data: intents,
                timestamp: new Date()
            })
        } catch (e) {
            
        }
    }

    private async publishIntent(req: Request<{}, {}, Mempool>, res: Response) {
        try {
            const body = req.body

            const intent = await prisma.mempool.create({
                data: body
            })

            await publishIntent(body)

            res.status(200).send({
                status: 200,
                data: intent,
                timestamp: new Date()
            })
        } catch (e) {
            
        }
    }

    private async solvedIntent(req: Request, res: Response) {
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
            
        }
    }
}