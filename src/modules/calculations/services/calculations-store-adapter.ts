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
  const skuDb = ref<SkuMap>({} as SkuMap)
  const skuList = ref<Sku[]>([] as Sku[])

  return {
    skuDb,
    skuList,
  }
})
