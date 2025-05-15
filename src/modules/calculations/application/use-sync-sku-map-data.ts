import {
  createSharedComposable,
  get,
  isDefined,
  set,
} from '@vueuse/core'
import {
  type Ref,
  ref,
} from 'vue'
import {
  useSkuMapApiAdapter,
  useSkuMapStore,
} from '@/shared/services/sku-map-service.js'

interface UseSyncSkuMap {
  isLoading: Ref<boolean>
  syncSkuMapData: () => Promise<void>
}

export const useSyncSkuMap = createSharedComposable((): UseSyncSkuMap => {
  const {skuMap, localVersion} = useSkuMapStore()
  const {loadSkuMap, getSkuMapServerVersion} = useSkuMapApiAdapter()
  const isLoading = ref(false)

  const shouldUpdateSkuMap = (
    serverVersion: number,
    currentVersion: number,
    mapSize: number,
  ): boolean => {
    return (
      serverVersion !== currentVersion
      || mapSize === 0
    )
  }

  const getServerVersion = async (): Promise<number | undefined> => {
    const response = await getSkuMapServerVersion()

    if (response.success) {
      return response.data
    }

    return undefined
  }

  const updateSkuMap = async (serverVersion: number): Promise<void> => {
    const response = await loadSkuMap()

    if (response.success) {
      set(localVersion, serverVersion)
      set(skuMap, response.data)
    } else {
      alert('error on load Db')
      console.log('error', response.errorMessage)
    }
  }

  const syncSkuMapData = async (): Promise<void> => {
    set(isLoading, true)

    const serverVersion = await getServerVersion()

    if (!isDefined(serverVersion)) {
      alert('error on load version')
      set(isLoading, false)
      return
    }

    /** todo: разобраться с типом строка или число */
    if (shouldUpdateSkuMap(serverVersion, Number(get(localVersion)), get(skuMap).size)) {
      await updateSkuMap(serverVersion)
    }

    set(isLoading, false)
  }

  return {
    syncSkuMapData,
    isLoading,
  }
})
