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

const onDeleteSku = (id: number): void => {
  emit('deleteSku', id)
}
</script>

<template>
  <tr :class="{active: isSkuSelected}">
    <td>{{ sku.id }}</td>
    <td>{{ sku.description}}</td>
    <td>{{ sku.multiplier }}</td>
    <td>{{ sku.cost }} ₽</td>
    <td>
      <span
        v-if="sku.discount > 0"
        class="discount-badge"
      >{{ sku.discount }}%</span>
    </td>
    <td class="actions">
      <button
        type="button"
        @click.stop="onDeleteSku(sku.id)"
        class="btn btn-danger btn-sm"
      >
        🗑️
      </button>
    </td>
  </tr>
</template>

<style scoped>
.articles-table td {
  padding: 0.75rem;
  border-bottom: 1px solid #e0e0e0;
}

.articles-table .active {
  background-color: #f5f5f5;
}

.articles-table tr:hover {
  background-color: #f5f5f5;
}

.articles-table .actions {
  display: flex;
  gap: 5px;
}

.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
}

.btn-danger {
  background-color: #d9534f;
  color: white;
}

.btn-danger:hover {
  background-color: #c9302c;
}

.btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.85rem;
}

.discount-badge {
  background-color: #5cb85c;
  color: white;
  padding: 0.2rem 0.5rem;
  border-radius: 10px;
  font-size: 0.8rem;
}
</style>
