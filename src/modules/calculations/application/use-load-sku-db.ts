import {
  useCalculationStore,
} from '@/modules/calculations/services/calculations-store-adapter.ts'
import {
  useCalculationsApiAdapter,
} from '@/modules/calculations/services/calculations-api-adapter.ts'

interface UseLoadSkuDb {
  loadSkuDb: () => Promise<void>
}

export const useLoadSkuDb = (): UseLoadSkuDb => {
  const {skuMap} = useCalculationStore()
  const {getSku} = useCalculationsApiAdapter()

  const loadSkuDb = async (): Promise<void> => {
    const response = await getSku()

    response.forEach((sku) => {
      skuMap.set(sku.id, {
        cost: sku.cost,
        ...sku.steps && {steps: sku.steps},
      })
    })
  }

  return {
    loadSkuDb,
  }
}
