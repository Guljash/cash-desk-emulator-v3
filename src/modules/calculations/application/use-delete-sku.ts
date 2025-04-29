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
  deleteSku: (id: SkuId) => void
}

export const useDeleteSku = (): UseDeleteSku => {
  const {skuList, selectedSku} = useCalculationStore()

  const deleteSku = (id: SkuId): void => {
    set(skuList, [...get(skuList).filter((sku) => sku.id !== id)])
    set(selectedSku, get(skuList).at(-1) ?? [])
  }

  return {
    deleteSku,
  }
}
