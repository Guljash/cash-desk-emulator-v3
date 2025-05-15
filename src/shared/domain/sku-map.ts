export type PriceChangeMethod = 'cost' | 'discount'

export interface Steps {
  method: PriceChangeMethod
  stepsData: {multiplier: number; value: number}[]
}

export type SkuId = number

export interface SkuBase {
  cost: number
  id: SkuId
  steps?: Steps
}

export type SkuMap = Readonly<Map<SkuId, Readonly<Omit<SkuBase, 'id'>>>>

export type SkuMapVersion = number | null
