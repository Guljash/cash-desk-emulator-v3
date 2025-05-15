import {
  useCalculationStore,
} from '@/modules/calculations/services/calculations-store-adapter.ts'
import {
  useCalculationsApiAdapter,
} from '@/modules/calculations/services/calculations-api-adapter.ts'
import {
  createSharedComposable,
  set,
} from '@vueuse/core'
import {
  type Ref,
  ref,
} from 'vue'

interface UseLoadSkuDb {
  isLoading: Ref<boolean>
  loadSkuDb: () => Promise<void>
}

export const useLoadSkuDb = createSharedComposable((): UseLoadSkuDb => {
  const {skuMap} = useCalculationStore()
  const {getSku} = useCalculationsApiAdapter()
  const isLoading = ref(false)

  const loadSkuDb = async (): Promise<void> => {
    set(isLoading, true)

    const response = await getSku()

    if (response.success) {
      set(skuMap, response.data)
    } else {
      console.log('error', response.errorMessage)
    }

    set(isLoading, false)
  }

  return {
    loadSkuDb,
    isLoading,
  }
})
