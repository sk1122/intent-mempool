import { ethers } from "ethers"

export const WS_PORT = Number(process.env.WS_PORT)

export const getEvmRPC = (chainId: number) => {
    return ethers.getDefaultProvider("https://rpc.ankr.com/polygon")
}