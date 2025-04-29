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
import {
  useChangeMultiplier,
} from '@/modules/calculations/application/use-change-multiplier.js'

interface UseAddSku {
  addSku: (id: SkuId, multiplier: number) => void
}

export const useAddSku = (): UseAddSku => {
  const {skuDb, skuList, selectedSku} = useCalculationStore()
  const {changeMultiplier} = useChangeMultiplier()

  const addSku = (id: SkuId, multiplier: number): void => {
    const currentSkuIdDb = get(skuDb)[id]

    if (currentSkuIdDb === undefined) {
      return
    }

    const foundedSku = get(skuList).find((skuItem) => skuItem.id === id)

    if (foundedSku) {
      changeMultiplier(id, foundedSku.multiplier + multiplier)
      return
    }

    const sku: Sku = {
      id,
      multiplier,
      cost: currentSkuIdDb.cost,
      discount: 0,
      ...currentSkuIdDb.steps && {steps: currentSkuIdDb.steps},
    }

    set(selectedSku, sku)
    set(skuList, [...get(skuList), sku])
  }

  return {
    addSku,
  }
}
