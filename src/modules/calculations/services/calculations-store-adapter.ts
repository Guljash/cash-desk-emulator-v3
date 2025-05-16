import {
  ref,
} from 'vue'
import {
  createGlobalState,
} from '@vueuse/core'
import {
  type Sku,
} from '@/modules/calculations/domain/types.ts'
import {
  type CalculationStore,
} from '@/modules/calculations/ports.js'

export const useCalculationStore = createGlobalState((): CalculationStore => {
  const skuList = ref<Sku[]>([])
  const selectedSku = ref<Sku>()
  const discountForAllPercent = ref(0)

  return {
    skuList,
    selectedSku,
    discountForAllPercent,
  }
})
