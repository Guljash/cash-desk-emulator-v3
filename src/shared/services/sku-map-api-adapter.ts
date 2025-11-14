import {
  type SkuId,
  type SkuMap,
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
import {
  type ParsedResponse,
  type SkuMapApiAdapter,
} from '@/shared/ports/sku-map-ports.js'

interface RawPricingModel {
  method: 'cost' | 'discount'
  priceTiers: {maxQuantity: number | null; value: number}[]
}

interface RawSkuItem {
  cost: number
  pricingModel?: RawPricingModel
}

type RawSkuMap = Record<SkuId, RawSkuItem>

export const useSkuMapApiAdapter = (): SkuMapApiAdapter => {
  const {db} = useFirebase()

  const parseGetSkuResponse = (response: RawSkuMap): ParsedResponse<SkuMap> => {
    const data = new Map(
      Object.entries(response).map(([key, value]) => [
        key, {...value, ...value.pricingModel && {pricingModel: value.pricingModel}},
      ]),
    ) as SkuMap

    console.log(data)

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
      const articlesSnap = await get(dbRef(db, 'skuMap'))
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
