import {
  set,
} from '@vueuse/core'
import {
  useCalculationStore,
} from '@/modules/calculations/services/calculations-store-adapter.ts'
import {
  useCalculationsApiAdapter,
} from '@/modules/calculations/services/calculations-api-adapter.ts'
import {
  type SkuMap,
} from '@/modules/calculations/domain/types.ts'

interface UseLoadSkuDb {
  loadSkuDb: () => Promise<void>
}

export const useLoadSkuDb = (): UseLoadSkuDb => {
  const {skuDb} = useCalculationStore()
  const {getSku} = useCalculationsApiAdapter()

  const loadSkuDb = async (): Promise<void> => {
    const response = await getSku()
    const skuMap: SkuMap = {}

    response.forEach((sku) => {
      skuMap[sku.id] = {
        cost: sku.cost,
        ...sku.steps && {steps: sku.steps},
      }
    })

    set(skuDb, skuMap)
  }

  return {
    loadSkuDb,
  }
}
