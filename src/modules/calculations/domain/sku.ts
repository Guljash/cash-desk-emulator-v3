import {
  type Sku,
  type SkuBase,
  type SkuId,
} from '@/modules/calculations/domain/types.js'

export const createSkuItem = (id: SkuId, multiplier: number, skuBaseItem: Readonly<Omit<SkuBase, 'id'>>): Sku => {
  return {
    id,
    multiplier,
    cost: skuBaseItem.cost,
    discount: 0,
    ...skuBaseItem.steps && {steps: skuBaseItem.steps},
  }
}

export const addSku = (skuList: Sku[], skuItem: Sku): Sku[] => [...skuList, skuItem]

export const findSkuById = (skuList: Sku[], skuId: SkuId): Sku | undefined => skuList.find((skuItem) => skuItem.id === skuId)
