import {
  type SkuId,
  type SkuMap,
  type Steps,
} from '@/modules/calculations/domain/types.ts'
import {
  ref as dbRef,
  get,
} from 'firebase/database'
import {
  useFirebase,
} from '@/shared/services/firebase.js'

export interface ParsedErrorResponse {
  errorMessage: string
  success: false
}

export type ParsedResponse<T = undefined> = ParsedErrorResponse | {
  data: T
  success: true
}

interface RawSteps {
  method: 'cost' | 'discount'
  stepsData: {multiplier: number | null; value: number}[]
}

interface RawSkuItem {
  cost: number
  steps?: RawSteps
}

type RawSkuMap = Record<SkuId, RawSkuItem>

interface UseCalculationsApiAdapter {
  getSku: () => Promise<ParsedResponse<SkuMap>>
}

const parseSkuSteps = (steps: RawSteps): Steps => {
  return {
    ...steps,
    stepsData: steps.stepsData.map((item) => ({
      ...item,
      multiplier: item.multiplier ?? Infinity,
    })),
  }
}

const parseGetSkuResponse = (response: RawSkuMap): ParsedResponse<SkuMap> => {
  const data = new Map(
    Object.entries(response).map(([key, value]) => [
      Number(key), {...value, ...value.steps && {steps: parseSkuSteps(value.steps)}},
    ]),
  ) as SkuMap

  return {
    success: true,
    data,
  }
}

export const useCalculationsApiAdapter = (): UseCalculationsApiAdapter => {
  const {db} = useFirebase()

  const getSku = async (): Promise<ParsedResponse<SkuMap>> => {
    try {
      const articlesSnap = await get(dbRef(db, 'skuList'))
      const response = articlesSnap.val() as RawSkuMap

      return parseGetSkuResponse(response)
    } catch (e) {
      console.error(e)
      return {
        success: false,
        errorMessage: 'error',
      }
    }
  }

  return {
    getSku,
  }
}
