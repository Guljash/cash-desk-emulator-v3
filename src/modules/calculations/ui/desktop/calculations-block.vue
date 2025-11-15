<script setup lang="ts">
import {
  computed,
  nextTick,
  ref,
} from 'vue'
import {
  get,
  set,
} from '@vueuse/core'
import CalculationsTable from '@/modules/calculations/ui/desktop/calculations-table.vue'
import {
  type Sku,
} from '@/modules/calculations/domain/types.ts'
import {
  useCalculationStore,
} from '@/modules/calculations/services/calculations-store-adapter.js'
import {
  useDeleteSku,
} from '@/modules/calculations/application/use-delete-sku.js'
import {
  useSetDiscount,
} from '@/modules/calculations/application/use-set-discount.js'
import {
  useSyncSkuMap,
} from '@/modules/calculations/application/use-sync-sku-map-data.js'
import {
  useSkuMapStore,
} from '@/shared/services/sku-map-store-adapter.js'
import {
  useInputGroup,
} from '@/modules/calculations/ui/common/use-input-group.js'
import CalculationsInputGroup from '@/modules/calculations/ui/desktop/calculations-input-group.vue'

const calculationsInputGroupRef = ref<InstanceType<typeof CalculationsInputGroup>>()

const {skuList, selectedSku, discountForAllPercent} = useCalculationStore()
const {deleteSku} = useDeleteSku()
const {setDiscountForAll} = useSetDiscount()
const {skuMap} = useSkuMapStore()
const {isLoading} = useSyncSkuMap()

const normalizeDecimalSeparator = (value: string): string => {
  const validationResult = /[0-9]*[.,]?[0-9]*/.exec(value)

  return Array.isArray(validationResult) ? validationResult[0].replace(/\./g, ',') : ''
}

const inputModelValue = defineModel<string>({
  set(value) {
    return normalizeDecimalSeparator(value)
  },
  get(value) {
    return normalizeDecimalSeparator(value)
  },
  default: '',
})

const {isBtnDisabled, withWrapper} = useInputGroup(inputModelValue)

const result = computed(() => Math.round(get(skuList).reduce((sum, sku) => sum + sku.multiplier * sku.cost, 0) * 2) / 2)
const resultWithoutDiscount = computed(() => {
  return Math.round(get(skuList).reduce((sum, sku) => sum + sku.multiplier * get(skuMap).get(sku.id)!.cost, 0) * 2) / 2
})

const onSelectSku = async (sku: Sku): Promise<void> => {
  set(selectedSku, sku)

  await nextTick()
  get(calculationsInputGroupRef)?.focus()
}
</script>

<template>
  <main
    class="main-content"
  >
    <div v-if="isLoading">
      loading...
    </div>
    <div
      v-else
      class="articles-block"
    >
      <div class="table-form-wrapper">
        <CalculationsTable
          @selectSku="onSelectSku"
          @deleteSku="(id) => withWrapper(() => deleteSku(id))"
        />
      </div>
      <CalculationsInputGroup
        ref="calculationsInputGroupRef"
        v-model="inputModelValue"
      />
    </div>
    <div
      v-if="skuList.length > 0"
      class="final-group"
    >
      <div class="text-block">
        <div>
          <div>
            <span>Итого без скидки:</span>
            <span>{{ resultWithoutDiscount }} ₽</span>
          </div>
          <div>
            <span>Скидка на чек:</span>
            <span>{{ discountForAllPercent }}%</span>
          </div>
        </div>
        <div class="result u-bold">
          <span>Итого:</span>
          <span>{{ result }} ₽</span>
        </div>
      </div>
      <button
        @click="withWrapper(() => setDiscountForAll(parseInt(inputModelValue)))"
        type="button"
        :disabled="isBtnDisabled"
        class="btn btn-secondary"
      >
        Скидка на чек
      </button>
    </div>
  </main>
</template>

<style scoped>
.main-content {
  width: 900px;
  height: 600px;
  display: flex;
}

.articles-block {
  display: flex;
  width: 690px;
  height: 100%;
  flex-direction: column;
}

.articles-block h2 {
  color: #444;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e0e0e0;
}

.table-form-wrapper {
  display: flex;
}

.final-group {
  display: flex;
  gap: 22px;
  flex-direction: column;
  margin-left: 10px;
}

.final-group .text-block {
  height: 130px;
  width: 200px;
  border-radius: 8px;
  padding: 20px;
  background-color: #FFFFFF;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.final-group .text-block .result {
  display: flex;
  justify-content: space-between;
  border-top: 1px solid #F4F5FA;
  padding-top: 15px;
}

.final-group .text-block div div {
  display: flex;
  justify-content: space-between;
  padding-bottom: 15px;
}
</style>
