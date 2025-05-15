import {
  get,
  set,
} from '@vueuse/core'
import {
  useCalculationStore,
} from '@/modules/calculations/services/calculations-store-adapter.ts'
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
import {
  useSkuMapStore,
} from '@/shared/services/sku-map-service.js'
import {
  type SkuId,
} from '@/shared/domain/sku-map.js'

interface UseAddSku {
  addSkuById: (id: SkuId, multiplier: number) => void
}

export const useAddSku = (): UseAddSku => {
  const {
    skuList,
    selectedSku,
    discountForAllPercent,
  } = useCalculationStore()
  const {changeMultiplierById} = useChangeMultiplier()
  const {setDiscount} = useSetDiscount()
  const {skuMap} = useSkuMapStore()

  const addSkuById = (id: SkuId, multiplier: number): void => {
    const currentSkuIdDb = get(skuMap).get(id)

    if (currentSkuIdDb === undefined) {
      alert('Артикул не найден')
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
