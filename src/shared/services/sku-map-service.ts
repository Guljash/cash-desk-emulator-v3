import {
  createGlobalState,
  useLocalStorage,
} from '@vueuse/core'
import {
  type SkuId,
  type SkuMap,
  type SkuMapVersion,
  type Steps,
} from '@/shared/domain/sku-map.js'
import {
  useFirebase,
} from '@/shared/services/firebase.js'
import {
  get,
} from 'firebase/database'
import {
  ref as dbRef,
} from '@firebase/database'

export interface ParsedErrorResponse {
  errorMessage: string
  success: false
}

export type ParsedResponse<T = undefined> = ParsedErrorResponse | {
  data: T
  success: true
}

interface RawSteps {
  method: 'cost' | 'discount'
  stepsData: {multiplier: number | null; value: number}[]
}

interface RawSkuItem {
  cost: number
  steps?: RawSteps
}

type RawSkuMap = Record<SkuId, RawSkuItem>

interface UseSkuMapApiAdapter {
  getSkuMapServerVersion: () => Promise<ParsedResponse<number>>
  loadSkuMap: () => Promise<ParsedResponse<SkuMap>>
}

export const useSkuMapStore = createGlobalState(() => {
  const skuMap = useLocalStorage('skuMap', new Map() as SkuMap)
  const localVersion = useLocalStorage<SkuMapVersion>('skuMapVersion', 0)

  return {
    skuMap,
    localVersion,
  }
})

export const useSkuMapApiAdapter = (): UseSkuMapApiAdapter => {
  const {db} = useFirebase()

  const parseSkuSteps = (steps: RawSteps): Steps => {
    return {
      ...steps,
      stepsData: steps.stepsData.map((item) => ({
        ...item,
        multiplier: item.multiplier ?? Infinity,
      })),
    }
  }

  const parseGetSkuResponse = (response: RawSkuMap): ParsedResponse<SkuMap> => {
    const data = new Map(
      Object.entries(response).map(([key, value]) => [
        Number(key), {...value, ...value.steps && {steps: parseSkuSteps(value.steps)}},
      ]),
    ) as SkuMap

    return {
      success: true,
      data,
    }
  }

  const getSkuMapServerVersion = async (): Promise<ParsedResponse<number>> => {
    try {
      const articlesSnap = await get(dbRef(db, 'meta/skuMapVersion'))
      const response = articlesSnap.val() as number

      return {
        success: true,
        data: response,
      }
    } catch (e) {
      console.error(e)
      return {
        success: false,
        errorMessage: 'error',
      }
    }
  }

  const loadSkuMap = async (): Promise<ParsedResponse<SkuMap>> => {
    try {
      const articlesSnap = await get(dbRef(db, 'skuList'))
      const response = articlesSnap.val() as RawSkuMap

      return parseGetSkuResponse(response)
    } catch (e) {
      console.error(e)
      return {
        success: false,
        errorMessage: 'error',
      }
    }
  }

  return {
    loadSkuMap,
    getSkuMapServerVersion,
  }
}
