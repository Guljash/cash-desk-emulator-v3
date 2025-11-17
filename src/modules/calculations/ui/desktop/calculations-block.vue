<script setup lang="ts">
import {
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
} from '@/modules/calculations/services/calculations-store-adapter.ts'
import {
  useDeleteSku,
} from '@/modules/calculations/application/use-delete-sku.ts'
import {
  useSyncSkuMap,
} from '@/modules/calculations/application/use-sync-sku-map-data.ts'
import {
  useInputGroup,
} from '@/modules/calculations/ui/common/use-input-group.ts'
import CalculationsInputGroup from '@/modules/calculations/ui/desktop/calculations-input-group.vue'
import CalculationsResultGroup from '@/modules/calculations/ui/desktop/calculations-result-group.vue'

const calculationsInputGroupRef = ref<InstanceType<typeof CalculationsInputGroup>>()

const {selectedSku} = useCalculationStore()
const {deleteSku} = useDeleteSku()
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

const {withWrapper} = useInputGroup(inputModelValue)

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
      class="sku-block"
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
    <CalculationsResultGroup />
  </main>
</template>

<style scoped>
.main-content {
  width: 900px;
  height: 600px;
  display: flex;
}

.sku-block {
  display: flex;
  width: 690px;
  height: 100%;
  flex-direction: column;
}

.table-form-wrapper {
  display: flex;
}
</style>
