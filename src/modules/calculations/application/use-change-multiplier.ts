import {
  get,
  set,
} from '@vueuse/core'
import {
  useCalculationStore,
} from '@/modules/calculations/services/calculations-store-adapter.ts'
import {
  changeSkuMultiplierInList,
} from '@/modules/calculations/domain/sku.js'
import {
  useSkuMapStore,
} from '@/shared/services/sku-map-service.js'
import {
  type SkuId,
} from '@/shared/domain/sku-map.js'

interface UseChangeMultiplier {
  changeMultiplierById: (id: SkuId | undefined, multiplier: number) => void
}

export const useChangeMultiplier = (): UseChangeMultiplier => {
  const {skuList} = useCalculationStore()
  const {skuMap} = useSkuMapStore()

  const changeMultiplierById = (id: SkuId | undefined, multiplier: number): void => {
    if (id === undefined || Number.isNaN(multiplier)) {
      return
    }

    set(skuList, changeSkuMultiplierInList(get(skuMap), get(skuList), id, multiplier))
  }

  return {
    changeMultiplierById,
  }
}
