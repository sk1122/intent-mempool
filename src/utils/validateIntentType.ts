import { Mempool } from "@prisma/client";
import { prisma } from "../prisma";
import { Conditions } from "../types";

export const validateIntentType = async (intent: Mempool) => {
    const intentType = await prisma.intentType.findUniqueOrThrow({
        where: {
            id: intent.typeId
        }
    })

    return validateAllConditions(intent.conditions, intentType.conditions)
}

export const validateAllConditions = async (allConditions: string, allConditionType: string) => {
    const parsedAllConditions = JSON.parse(allConditions)
    const parsedAllConditionTypes = JSON.parse(allConditionType)
    
    const {
        conditions,
        preConditions
    } = parsedAllConditions

    const {
        conditions: conditionsType,
        preConditions: preConditionsType
    } = parsedAllConditionTypes

    if(!(validateDiff(Object.keys(conditions), Object.keys(conditionsType)) && validateDiff(Object.keys(preConditions), Object.keys(preConditionsType)))) {
        throw new Error("keys are not the same in conditions or preconditions")
    }

    if(!(matchTypes(conditionsType, conditions) && matchTypes(preConditionsType, preConditions))) {
        throw new Error("keys and values aren't matching types")
    }

    return true
}

export const matchTypes = (typeObj: any, valuesObj: any) => {
    const keys1 = Object.keys(typeObj)

    for(let i = 0; i < keys1.length; i++) {
        const type = typeObj[keys1[i]]
        const value = valuesObj[keys1[i]]

        if(typeof(value) !== type) {
            throw new Error("values and type not match for " + keys1[i])
        }
    }

    return true
}

export const validateDiff = (keys: string[], keys2: string[]): boolean => {
    const diff = keys.filter(x => !keys2.includes(x)).concat(keys2.filter(x => !keys.includes(x)))

    return diff.length <= 0
}