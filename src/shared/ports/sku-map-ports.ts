import type {
  SkuMap,
} from '@/shared/domain/sku-map.js'
import {
  type Ref,
} from 'vue'
import {
  type SkuMapVersion,
} from '@/shared/services/sku-map-store-adapter.js'

export interface ParsedErrorResponse {
  errorMessage: string
  success: false
}

export type ParsedResponse<T = undefined> = ParsedErrorResponse | {
  data: T
  success: true
}

export interface SkuMapApiAdapter {
  getSkuMapServerVersion: () => Promise<ParsedResponse<number>>
  loadSkuMap: () => Promise<ParsedResponse<SkuMap>>
}

export interface SkuMapStoreAdapter {
  localVersion: Ref<SkuMapVersion>
  skuMap: Ref<SkuMap>
}
