import {
  get,
  set,
} from '@vueuse/core'
import {
  useCalculationStore,
} from '@/modules/calculations/services/calculations-store-adapter.ts'
import {
  type SkuId,
} from '@/modules/calculations/domain/types.ts'

interface UseDeleteSku {
  deleteSku: (id: SkuId | undefined) => void
}

export const useDeleteSku = (): UseDeleteSku => {
  const {skuList, selectedSku} = useCalculationStore()

  const deleteSku = (id: SkuId | undefined): void => {
    if (id === undefined) {
      return
    }

    set(skuList, [...get(skuList).filter((sku) => sku.id !== id)])
    set(selectedSku, get(skuList).at(-1))
  }

  return {
    deleteSku,
  }
}
