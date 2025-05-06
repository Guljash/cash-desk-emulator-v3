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
import {
  useSetDiscount,
} from '@/modules/calculations/application/use-set-discount.js'

interface UseAddSku {
  addSku: (id: SkuId, multiplier: number) => void
}

export const useAddSku = (): UseAddSku => {
  const {skuMap, skuList, selectedSku} = useCalculationStore()
  const {changeMultiplier} = useChangeMultiplier()
  const {discountForAllPercent, setDiscount} = useSetDiscount()

  const addSku = (id: SkuId, multiplier: number): void => {
    const currentSkuIdDb = skuMap.get(id)

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

    if (get(discountForAllPercent) > 0) {
      setDiscount(id, get(discountForAllPercent))
    }
  }

  return {
    addSku,
  }
}
