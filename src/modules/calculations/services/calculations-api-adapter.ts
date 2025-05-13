import {
  useCalculationsApi,
} from '@/modules/calculations/services/calculations-api.ts'
import {
  type SkuBase,
  SkuId,
  type Steps,
} from '@/modules/calculations/domain/types.ts'

interface UseCalculationsApiAdapter {
  getSku: () => Promise<Readonly<SkuBase[]>>
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

const parseGetSkuResponse = (response: RawSku[]): SkuBase[] => {
  return response.map((sku) => ({
    id: sku.id,
    cost: sku.cost,
    ...sku.steps && {steps: parseSkuSteps(sku.steps)},
  }))
}

export const useCalculationsApiAdapter = (): UseCalculationsApiAdapter => {
  const apiService = useCalculationsApi()

  const getSku = async (): Promise<SkuBase[]> => {
    const response = await apiService.getSku() as RawSku[]

    return parseGetSkuResponse(response)
  }

  return {
    getSku,
  }
}
