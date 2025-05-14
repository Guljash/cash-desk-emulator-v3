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
  addSkuToList,
  createSkuItem,
  findSkuById,
} from '@/modules/calculations/domain/sku.js'

interface UseAddSku {
  addSkuById: (id: SkuId, multiplier: number) => void
}

export const useAddSku = (): UseAddSku => {
  const {
    skuMap,
    skuList,
    selectedSku,
    discountForAllPercent,
  } = useCalculationStore()
  const {changeMultiplierById} = useChangeMultiplier()
  const {setDiscount} = useSetDiscount()

  const addSkuById = (id: SkuId, multiplier: number): void => {
    const currentSkuIdDb = get(skuMap).get(id)

    if (currentSkuIdDb === undefined) {
      return
    }

    const alreadyPushedSku = findSkuById(get(skuList), id)

    if (alreadyPushedSku) {
      changeMultiplierById(id, alreadyPushedSku.multiplier + multiplier)
      return
    }

    const sku = createSkuItem(id, multiplier, currentSkuIdDb)

    set(selectedSku, sku)
    set(skuList, addSkuToList(get(skuList), sku))

    if (get(discountForAllPercent) > 0) {
      setDiscount(id, get(discountForAllPercent))
    }
  }

  return {
    addSkuById,
  }
}
