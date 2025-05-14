import {
  useCalculationsApi,
} from '@/modules/calculations/services/calculations-api.ts'
import {
  type SkuBase,
  type Steps,
} from '@/modules/calculations/domain/types.ts'

export interface ParsedErrorResponse {
  errorMessage: string
  success: false
}

export type ParsedResponse<T = undefined> = ParsedErrorResponse | {
  data: T
  success: true
}

interface UseCalculationsApiAdapter {
  getSku: () => Promise<ParsedResponse<readonly SkuBase[]>>
}

interface RawSteps {
  method: 'cost' | 'discount'
  stepsData: {multiplier: number | null; value: number}[]
}

interface RawSku {
  cost: number
  id: number
  steps?: RawSteps
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

const parseGetSkuResponse = (response: RawSku[]): ParsedResponse<SkuBase[]> => {
  const data = response.map((sku) => ({
    id: sku.id,
    cost: sku.cost,
    ...sku.steps && {steps: parseSkuSteps(sku.steps)},
  }))

  return {
    success: true,
    data,
  }
}

export const useCalculationsApiAdapter = (): UseCalculationsApiAdapter => {
  const apiService = useCalculationsApi()

  const getSku = async (): Promise<ParsedResponse<SkuBase[]>> => {
    try {
      const response = await apiService.getSku() as RawSku[]

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
