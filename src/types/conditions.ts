export interface Condition {
    conditions: object[]
    preConditions: object[]
}

export interface CrossChainCondition {
    amountIn: string
    tokenIn: string
    chainIn: number

    amountOut?: string
    tokenOut: string
    chainOut: number

    slippage: number
}

export interface CrossChainPreCondition {
    tokenInPrice?: number
    tokenOutPrice?: number
}

export interface CrossChainConditions extends Condition {
    conditions: [CrossChainCondition],
    preConditions: [CrossChainPreCondition]
}