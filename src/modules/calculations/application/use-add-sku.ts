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
  useChangeMultiplier,
} from '@/modules/calculations/application/use-change-multiplier.js'
import {
  useSetDiscount,
} from '@/modules/calculations/application/use-set-discount.js'
import {
  addSku,
  createSkuItem,
  findSkuById,
} from '@/modules/calculations/domain/sku.js'

interface UseAddSku {
  addSkuById: (id: SkuId, multiplier: number) => void
}

export const useAddSku = (): UseAddSku => {
  const {skuMap, skuList, selectedSku} = useCalculationStore()
  const {changeMultiplier} = useChangeMultiplier()
  const {discountForAllPercent, setDiscount} = useSetDiscount()

  const addSkuById = (id: SkuId, multiplier: number): void => {
    const currentSkuIdDb = skuMap.get(id)

    if (currentSkuIdDb === undefined) {
      return
    }

    const foundedSku = findSkuById(get(skuList), id)

    if (foundedSku) {
      changeMultiplier(id, foundedSku.multiplier + multiplier)
      return
    }

    const sku = createSkuItem(id, multiplier, currentSkuIdDb)

    set(selectedSku, sku)
    set(skuList, addSku(get(skuList), sku))

    if (get(discountForAllPercent) > 0) {
      setDiscount(id, get(discountForAllPercent))
    }
  }

  return {
    addSkuById,
  }
}
