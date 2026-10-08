<script setup lang="ts">
import {
  type Sku,
} from '@/modules/calculations/domain/types.ts'
import {
  useCalculationStore,
} from '@/modules/calculations/services/calculations-store-adapter.ts'
import {
  computed,
} from 'vue'
import {
  get,
} from '@vueuse/core'
import {
  type SkuId,
} from '@/shared/domain/sku-map.js'

const props = defineProps<{
  sku: Sku
}>()

const emit = defineEmits<(e: 'deleteSku', id: SkuId) => void>()

const {selectedSku} = useCalculationStore()

const isSkuSelected = computed(() => get(selectedSku)?.id == props.sku.id)

const onDeleteSku = (id: string): void => {
  emit('deleteSku', id)
}
</script>

<template>
  <div
    class="sku-row"
  >
    <div
      class="sku-row__sku-item u-bold"
      :class="{active: isSkuSelected}"
    >
      <span>{{ sku.id }}</span>
    </div>

    <div
      class="sku-row__other"
      :class="{active: isSkuSelected}"
    >
      <div class="sku-row__description">
        <span>{{ sku.description }}</span>
      </div>

      <div class="sku-row__multiplier u-bold">
        <span>{{ sku.multiplier }} ед.</span>
      </div>

      <div class="sku-row__cost">
        <span>{{ sku.cost }} ₽</span>
      </div>

      <div class="sku-row__discount">
        <span
          v-if="sku.discount > 0"
          class="sku-row__discount-badge"
        >{{ sku.discount }}%</span>
      </div>

      <div
        v-if="isSkuSelected"
        class="sku-row__actions"
      >
        <button
          type="button"
          class="btn"
          title="Удалить артикул"
          @click.stop="onDeleteSku(sku.id)"
        >
          <img
            src="@/shared/assets/icons/delete.svg"
            alt=""
          >
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sku-row {
  display: flex;
  gap: 22px;
  margin-bottom: 4px;
  cursor: pointer;
}

.sku-row > div {
  height: 35px;
  background-color: var(--color-background-secondary);
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.05);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
}

.sku-row__sku-item {
  width: 85px;
  justify-content: center;
}

.sku-row__other > div:not(.sku-row__actions) {
  height: 100%;
  display: flex;
  align-items: center;
  padding: var(--spacing-sm);
  min-width: 80px;
}

.sku-row__description {
  width: 200px;
}

.sku-row__actions {
  justify-content: center;
  max-width: 48px;
}

.sku-row__discount {
  justify-content: center;
}

.sku-row > div.active {
  outline: 1.5px solid #1D9AFC;
  outline-offset: -1.5px;
}

.sku-row__actions {
  display: flex;
  gap: 5px;
}

.btn {
  background-color: transparent;
  border: none;
  cursor: pointer;
}

.sku-row__discount-badge {
  background-color: #5cb85c;
  color: white;
  padding: 0.2rem 0.5rem;
  border-radius: var(--radius-lg);
  font-size: 0.8rem;
}
</style>
