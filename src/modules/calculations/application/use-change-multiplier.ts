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

interface UseChangeMultiplier {
  changeMultiplier: (id: SkuId | undefined, multiplier: number) => void
}

export const useChangeMultiplier = (): UseChangeMultiplier => {
  const {skuList} = useCalculationStore()

  const changeMultiplier = (id: SkuId | undefined, multiplier: number): void => {
    if (id === undefined || Number.isNaN(multiplier)) {
      return
    }

    const changedSkuList = get(skuList).map((sku) => sku.id === id ? {...sku, multiplier} : sku)

    set(skuList, changedSkuList)
  }

  return {
    changeMultiplier,
  }
}
