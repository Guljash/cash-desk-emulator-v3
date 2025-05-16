import {
  type Sku,
} from '@/modules/calculations/domain/types.js'
import {
  type Ref,
} from 'vue'

export interface CalculationStore {
  discountForAllPercent: Ref<number>
  selectedSku: Ref<Sku | undefined>
  skuList: Ref<Sku[]>
}
