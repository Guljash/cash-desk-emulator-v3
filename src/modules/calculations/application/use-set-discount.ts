import {
  get,
  set,
} from '@vueuse/core'
import {
  useCalculationStore,
} from '@/modules/calculations/services/calculations-store-adapter.ts'
import {
  setSkuDiscountInList,
} from '@/modules/calculations/domain/sku.js'
import {
  useSkuMapStore,
} from '@/shared/services/sku-map-store-adapter.js'
import {
  type SkuId,
} from '@/shared/domain/sku-map.js'

interface UseSetDiscount {
  setDiscount: (id: SkuId | undefined, discount: number) => void
  setDiscountForAll: (discount: number) => void
}

export const useSetDiscount = (): UseSetDiscount => {
  const {skuList, discountForAllPercent} = useCalculationStore()
  const {skuMap} = useSkuMapStore()

  const setDiscount = (id: SkuId | undefined, discount: number): void => {
    if (id === undefined || Number.isNaN(discount) || discount > 100) {
      return
    }
    set(skuList, setSkuDiscountInList(get(skuMap), get(skuList), id, discount))
  }

  const setDiscountForAll = (discount: number): void => {
    if (Number.isNaN(discount)) {
      return
    }

    get(skuList).forEach((sku) => {
      const finalDiscount = discount + sku.discount - get(discountForAllPercent)
      setDiscount(sku.id, finalDiscount)
    })

    set(discountForAllPercent, discount)
  }

  return {
    setDiscount,
    setDiscountForAll,
  }
}
