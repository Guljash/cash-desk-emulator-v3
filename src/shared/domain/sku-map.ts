export type PriceChangeMethod = 'cost' | 'discount'

export interface PricingModel {
  method: PriceChangeMethod
  priceTiers: {maxQuantity: number; value: number}[]
}

export type SkuId = string

export interface SkuBase {
  cost: number
  description: string
  id: SkuId
  pricingModel?: PricingModel
}

export type SkuMap = Readonly<Map<SkuId, Readonly<Omit<SkuBase, 'id'>>>>
