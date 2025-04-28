import {
  get,
  set,
} from '@vueuse/core'
import {
  useCalculationStore,
} from '@/modules/calculations/services/calculations-store-adapter.ts'
import {
  type Sku,
  type SkuId,
} from '@/modules/calculations/domain/types.ts'

interface UseAddSku {
  addSku: (id: SkuId, multiplier: number) => void
}

export const useAddSku = (): UseAddSku => {
  const {skuDb, skuList} = useCalculationStore()

  const addSku = (id: SkuId, multiplier: number): void => {
    const currentSkuIdDb = get(skuDb)[id]

    if (currentSkuIdDb === undefined) {
      return
    }

    if (get(skuList).some((skuItem) => skuItem.id === id)) {
      // меняем количество
      return
    }

    const sku: Sku = {
      id,
      multiplier,
      cost: currentSkuIdDb.cost,
      active: true,
      discount: 0,
    }

    set(skuList, [...get(skuList), sku])
  }

  return {
    addSku,
  }
}
