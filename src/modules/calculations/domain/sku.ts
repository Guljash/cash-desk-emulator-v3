import {
  type Sku,
} from '@/modules/calculations/domain/types.js'
import {
  type SkuBase,
  type SkuId,
  type SkuMap,
  type Steps,
} from '@/shared/domain/sku-map.js'

export const createSkuItem = (id: SkuId, multiplier: number, skuBaseItem: Readonly<Omit<SkuBase, 'id'>>): Sku => {
  return {
    id,
    multiplier,
    cost: skuBaseItem.cost,
    discount: 0,
    ...skuBaseItem.steps && {steps: skuBaseItem.steps},
  }
}

export const addSkuToList = (skuList: Sku[], skuItem: Sku): Sku[] => [...skuList, skuItem]

export const deleteSkuInList = (skuList: Sku[], skuId: SkuId): Sku[] => skuList.filter((sku) => sku.id !== skuId)

export const findSkuById = (skuList: Sku[], skuId: SkuId): Sku | undefined => skuList.find((skuItem) => skuItem.id === skuId)

const applyDiscountToSku = (skuMap: SkuMap, skuItem: Sku, discount: number): Sku => (
  {...skuItem, discount, cost: Math.round(skuMap.get(skuItem.id)!.cost * (1 - (discount / 100)))}
)

export const setSkuDiscountInList = (
  skuMap: SkuMap,
  skuList: Sku[],
  skuId: SkuId,
  discount: number,
): Sku[] => skuList.map((sku) => {
  return sku.id === skuId ? applyDiscountToSku(skuMap, sku, discount) : sku
})

const getStepValueByMultiplier = (stepsData: Steps['stepsData'], multiplier: number): number => {
  return stepsData.find((step) => multiplier < step.multiplier)?.value ?? 0
}

const applyStepToSku = (skuMap: SkuMap, sku: Sku, multiplier: number): Sku => {
  let changedSku = {...sku, multiplier}

  switch (sku?.steps?.method) {
    case 'discount': {
      const discount = getStepValueByMultiplier(sku.steps.stepsData, multiplier)

      changedSku = applyDiscountToSku(skuMap, changedSku, discount)
      break
    }
    case 'cost': {
      changedSku.cost = getStepValueByMultiplier(sku.steps.stepsData, multiplier)
      break
    }
    case undefined: {
      break
    }
  }

  return changedSku
}

export const changeSkuMultiplierInList = (
  skuMap: SkuMap,
  skuList: Sku[],
  skuId: SkuId,
  multiplier: number,
): Sku[] => {
  return skuList.map((sku) => sku.id === skuId ? applyStepToSku(skuMap, sku, multiplier) : sku)
}
