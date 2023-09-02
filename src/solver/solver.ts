import { Mempool } from "@prisma/client";
import axios from "axios"
import { BuildTransactionConfig, TransactionType, buildErc20ApproveTransaction } from "../types";
import { getEvmRPC } from "../config";

interface Conditions {
    conditions: {
        fromAddress: string
        toAddress: string

        amountIn: string
        tokenIn: string
        chainIn: number

        amountOut: string
        tokenOut: string
        chainOut: number

        slippage: number
    }
    preConditions: {
        outPrice?: string
    }
}

export const lifiAdapter = async (tx: BuildTransactionConfig): Promise<any[]> => {
    const rpc = getEvmRPC(tx.fromChain);

	const result = await axios.get(`https://li.quest/v1/quote`, {
		params: {
			fromChain: tx.fromChain,
			toChain: tx.toChain,
			fromToken: tx.fromToken,
			toToken: tx.toToken,
			fromAmount: tx.fromAmount,
			fromAddress: tx.fromAddress,
			toAddress: tx.toAddress
		},
	});

	const bridge = result.data;

    const approveTxData = buildErc20ApproveTransaction(bridge.estimate.approvalAddress, tx.fromAmount!)
    const approveTx = {
        from: tx.fromAddress,
        to: tx.fromToken,
        value: 0,
        data: approveTxData,
        gasLimit:
            (
                await rpc.estimateGas({
                    from: tx.fromAddress,
                    to: tx.fromToken,
                    value: 0,
                    data: approveTxData,
                })
            )._hex ?? undefined,
        gasPrice: (await rpc.getGasPrice())._hex,
    }

    const txs = [
        {
            tx: approveTx,
            chain: tx.fromChain,
            type: TransactionType.APPROVE_TOKEN
        },
        {
            tx: bridge.transactionRequest,
            chain: tx.fromChain,
            type: TransactionType.TRANSFER_TOKEN
        }
    ]

    return txs
};

export const solve = async (intent: Mempool) => {
    const conditions = JSON.parse(intent.conditions) as Conditions

    const txs = await lifiAdapter({
        fromAddress: conditions.conditions.fromAddress,
        toAddress: conditions.conditions.toAddress,
        fromToken: conditions.conditions.tokenIn,
        toToken: conditions.conditions.tokenOut,
        fromChain: conditions.conditions.chainIn,
        toChain: conditions.conditions.chainOut,
        fromAmount: conditions.conditions.amountIn,
        toAmount: conditions.conditions.amountOut
    })

    return txs
}