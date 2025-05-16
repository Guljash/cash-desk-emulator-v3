import {
  type Sku,
} from '@/modules/calculations/domain/types.js'
import {
  type PricingModel,
  type SkuBase,
  type SkuId,
  type SkuMap,
} from '@/shared/domain/sku-map.js'

export const createSkuItem = (id: SkuId, multiplier: number, skuBaseItem: Readonly<Omit<SkuBase, 'id'>>): Sku => {
  return {
    id,
    multiplier,
    cost: skuBaseItem.cost,
    discount: 0,
    description: skuBaseItem.description,
    ...skuBaseItem.pricingModel && {pricingModel: skuBaseItem.pricingModel},
  }
}

export const addSkuToList = (skuList: Sku[], skuItem: Sku): Sku[] => [...skuList, skuItem]

export const deleteSkuInList = (skuList: Sku[], skuId: SkuId): Sku[] => skuList.filter((sku) => sku.id !== skuId)

export const findSkuById = (skuList: Sku[], skuId: SkuId): Sku | undefined => skuList.find((skuItem) => skuItem.id === skuId)

const applyDiscountToSku = (skuMap: SkuMap, skuItem: Sku, discount: number): Sku => {
  const basePrice = skuMap.get(skuItem.id)!.cost
  const discountedPrice = basePrice * (1 - discount / 100)

  return {
    ...skuItem,
    discount,
    cost: Number(discountedPrice.toFixed(2)),
  }
}

export const setSkuDiscountInList = (
  skuMap: SkuMap,
  skuList: Sku[],
  skuId: SkuId,
  discount: number,
): Sku[] => skuList.map((sku) => {
  return sku.id === skuId ? applyDiscountToSku(skuMap, sku, discount) : sku
})

const getStepValueByMultiplier = (priceTiers: PricingModel['priceTiers'], multiplier: number): number => {
  return priceTiers.find((step) => multiplier <= step.maxQuantity || step.maxQuantity === null)?.value ?? 0
}

const applyPriceTierToSku = (skuMap: SkuMap, sku: Sku, multiplier: number): Sku => {
  let changedSku = {...sku, multiplier}

  switch (sku?.pricingModel?.method) {
    case 'discount': {
      const discount = getStepValueByMultiplier(sku.pricingModel.priceTiers, multiplier)

      changedSku = applyDiscountToSku(skuMap, changedSku, discount)
      break
    }
    case 'cost': {
      changedSku.cost = getStepValueByMultiplier(sku.pricingModel.priceTiers, multiplier)
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
  return skuList.map((sku) => sku.id === skuId ? applyPriceTierToSku(skuMap, sku, multiplier) : sku)
}
