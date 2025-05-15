import {
  ref,
} from 'vue'
import {
  createGlobalState,
} from '@vueuse/core'
import {
  type Sku,
} from '@/modules/calculations/domain/types.ts'

export const useCalculationStore = createGlobalState(() => {
  const skuList = ref<Sku[]>([])
  const selectedSku = ref<Sku>()
  const discountForAllPercent = ref(0)

  return {
    skuList,
    selectedSku,
    discountForAllPercent,
  }
})
