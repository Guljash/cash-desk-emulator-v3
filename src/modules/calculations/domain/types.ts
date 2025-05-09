export type SkuId = number

export interface Steps {
  method: PriceChangeMethod
  stepsData: {multiplier: number[]; value: number[]}
}

export type PriceChangeMethod = 'discount' | 'multiplier'

export interface SkuBase {
  cost: number
  id: SkuId
  steps?: Steps
}

export interface Sku extends SkuBase {
  discount: number
  multiplier: number
}

export type SkuMap = Map<SkuId, Omit<SkuBase, 'id'>>
