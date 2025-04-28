import {
  useCalculationsApi,
} from '@/modules/calculations/services/calculations-api.ts'
import {
  type SkuBase,
} from '@/modules/calculations/domain/types.ts'

interface UseCalculationsApiAdapter {
  getSku: () => Promise<SkuBase[]>
}

export const useCalculationsApiAdapter = (): UseCalculationsApiAdapter => {
  const apiService = useCalculationsApi()

  const getSku = async (): Promise<SkuBase[]> => {
    const response = await apiService.getSku()

    return response as SkuBase[]
  }

  return {
    getSku,
  }
}
