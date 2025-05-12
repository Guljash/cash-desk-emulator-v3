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

interface UseChangeMultiplier {
  changeMultiplier: (id: SkuId | undefined, multiplier: number) => void
}

export const useChangeMultiplier = (): UseChangeMultiplier => {
  const {skuList} = useCalculationStore()

  const createSkuItem = (sku: Sku, multiplier: number): Sku => {
    const changedSku = {...sku, multiplier}

    switch (sku?.steps?.method) {
      case 'discount': {
        changedSku.discount += sku.steps.stepsData.find((step) => multiplier < step.multiplier)?.value ?? 0
        break
      }
      case 'cost': {
        changedSku.cost = sku.steps.stepsData.find((step) => multiplier < step.multiplier)?.value ?? 0
        break
      }
      case undefined: {
        break
      }
    }

    return changedSku
  }
  const changeMultiplier = (id: SkuId | undefined, multiplier: number): void => {
    if (id === undefined || Number.isNaN(multiplier)) {
      return
    }

    const changedSkuList = get(skuList).map((sku) => sku.id === id ? createSkuItem(sku, multiplier) : sku)

    set(skuList, changedSkuList)
  }

  return {
    changeMultiplier,
  }
}
