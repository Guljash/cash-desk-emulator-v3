import {
  ref,
} from 'vue'
import {
  createGlobalState,
  useLocalStorage,
} from '@vueuse/core'
import {
  type Sku,
  type SkuMap,
} from '@/modules/calculations/domain/types.ts'

export const useCalculationStore = createGlobalState(() => {
  const skuMap = useLocalStorage('skuMap', new Map() as SkuMap)

  const skuList = ref<Sku[]>([])

  const selectedSku = ref<Sku>()
  /** todo: подумать где в ui выводить текущий размер скидки */
  const discountForAllPercent = ref(0)

  return {
    skuMap,
    skuList,
    selectedSku,
    discountForAllPercent,
  }
})
