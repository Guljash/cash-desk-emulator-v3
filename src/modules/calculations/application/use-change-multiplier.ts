import {
  get,
  set,
} from '@vueuse/core'
import {
  useCalculationStore,
} from '@/modules/calculations/services/calculations-store-adapter.ts'
import {
  type SkuId,
} from '@/modules/calculations/domain/types.ts'
import {
  changeSkuMultiplierInList,
} from '@/modules/calculations/domain/sku.js'

interface UseChangeMultiplier {
  changeMultiplierById: (id: SkuId | undefined, multiplier: number) => void
}

export const useChangeMultiplier = (): UseChangeMultiplier => {
  const {skuList, skuMap} = useCalculationStore()
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
