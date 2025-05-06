import {
  ref,
} from 'vue'
import {
  createGlobalState,
} from '@vueuse/core'
import {
  type Sku,
  type SkuMap,
} from '@/modules/calculations/domain/types.ts'

export const useCalculationStore = createGlobalState(() => {
  const skuMap = new Map() as SkuMap
  const skuList = ref<Sku[]>([])

  const selectedSku = ref<Sku>()

  return {
    skuMap,
    skuList,
    selectedSku,
  }
})
