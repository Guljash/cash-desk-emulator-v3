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
  <main class="calculations-block">
    <div
      class="calculations-block__loader"
      v-if="isLoading"
    >
      <div class="loader-spinner">
        <div class="loader-spinner__circle" />
        <span class="loader-spinner__text">Загрузка данных...</span>
      </div>
    </div>
    <div
      class="calculations-block__content"
      v-else
    >
      <div class="calculations-block__workspace">
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
.calculations-block {
  width: 900px;
  height: 600px;
  display: flex;
}

.calculations-block__content {
  display: flex;
  width: 690px;
  height: 100%;
  flex-direction: column;
}

.calculations-block__workspace {
  display: flex;
}

.calculations-block__loader {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  width: 100%;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(8px);
  border-radius: var(--radius-lg);
  padding: var(--spacing-xl);
}

.loader-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-md);
}

.loader-spinner__circle {
  width: 56px;
  height: 56px;
  border: 3px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  border-top-color: var(--color-accent);
  animation: spin 1.2s cubic-bezier(0.5, 0.1, 0.5, 0.9) infinite;
}

.loader-spinner__text {
  color: var(--color-accent);
  font-size: 1.125rem;
  font-weight: 500;
  letter-spacing: 0.025em;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
