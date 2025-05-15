import {
  type SkuBase,
} from '@/shared/domain/sku-map.js'

export interface Sku extends SkuBase {
  discount: number
  multiplier: number
}
