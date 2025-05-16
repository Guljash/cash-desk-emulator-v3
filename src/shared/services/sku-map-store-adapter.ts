import {
  createGlobalState,
  useLocalStorage,
} from '@vueuse/core'
import type {
  SkuMap,
} from '@/shared/domain/sku-map.js'
import {
  type SkuMapStoreAdapter,
} from '@/shared/ports/sku-map-ports.js'

export type SkuMapVersion = number

export const useSkuMapStore = createGlobalState((): SkuMapStoreAdapter => {
  const skuMap = useLocalStorage('skuMap', new Map() as SkuMap)
  const localVersion = useLocalStorage<SkuMapVersion>('skuMapVersion', 0)

  return {
    skuMap,
    localVersion,
  }
})
