import {
  createSharedComposable,
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
  ref,
} from 'vue'

interface UseSetDiscount {
  setDiscount: (id: SkuId | undefined, discount: number) => void
  setDiscountForAll: (discount: number) => void
}

export const useSetDiscount = createSharedComposable((): UseSetDiscount => {
  const {skuList, skuDb} = useCalculationStore()
  const discountForAllPercent = ref(0)

  const setDiscount = (id: SkuId | undefined, discount: number): void => {
    if (id === undefined || Number.isNaN(discount) || discount > 100) {
      return
    }

    const changedSkuList = get(skuList).map((sku) => sku.id === id
      ? {
        ...sku, discount, cost: get(skuDb)[sku.id]!.cost * (1 - (discount / 100)),
      }
      : sku)

    set(skuList, changedSkuList)
  }

  const setDiscountForAll = (discount: number): void => {
    if (Number.isNaN(discount)) {
      return
    }

    get(skuList).forEach((sku) => {
      const finalDiscount = (sku.discount ? discount + sku.discount : discount) - get(discountForAllPercent)
      setDiscount(sku.id, finalDiscount)
    })

    set(discountForAllPercent, discount)
  }

  return {
    setDiscount,
    setDiscountForAll,
  }
})
