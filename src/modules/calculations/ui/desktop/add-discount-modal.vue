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
import Modal from '@/shared/ui/modal/desktop/modal.vue'

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
  <Modal>
    <div>123 я модалка</div>
  </Modal>
</template>

<style scoped>
.sku-row {
  display: flex;
  gap: 22px;
  margin-bottom: 4px;
  cursor: pointer;
}

.sku-row>div {
  height: 35px;
  background-color: #FFFFFF;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  display: flex;
  align-items: center;
}

.sku-item {
  width: 85px;
  justify-content: center;
}

.other>div:not(.actions) {
  height: 100%;
  display: flex;
  align-items: center;
  padding: 10px;
  min-width: 80px;
}

.other>div:first-child {
  width: 200px;
}

.other>div.actions{
  justify-content: center;
  max-width: 48px;
}

.other>div.discount{
  justify-content: center;
}

.sku-row>div.active {
  outline: 1.5px solid #1D9AFC;
  outline-offset: -1.5px;
}

.articles-table tr:hover {
  background-color: #f5f5f5;
}

.articles-table .actions {
  display: flex;
  gap: 5px;
}

.btn {
  background-color: transparent;
  border: none;
  cursor: pointer;
}

.discount-badge {
  background-color: #5cb85c;
  color: white;
  padding: 0.2rem 0.5rem;
  border-radius: 10px;
  font-size: 0.8rem;
}
</style>
