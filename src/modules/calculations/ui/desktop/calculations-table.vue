<script setup lang="ts">
import SkuItem from '@/modules/calculations/ui/desktop/sku-item.vue'
import {
  useCalculationStore,
} from '@/modules/calculations/services/calculations-store-adapter.ts'
import {
  type Sku,
} from '@/modules/calculations/domain/types.ts'
import {
  type SkuId,
} from '@/shared/domain/sku-map.ts'

const emit = defineEmits<{
  (e: 'selectSku', sku: Sku): void
  (e: 'deleteSku', id: SkuId): void
}>()

const {skuList} = useCalculationStore()

const onSelectSku = (sku: Sku): void => {
  emit('selectSku', sku)
}

const onDeleteSku = (id: SkuId): void => {
  emit('deleteSku', id)
}
</script>

<template>
  <div
    v-if="skuList.length > 0"
    class="articles-table"
  >
    <SkuItem
      v-for="sku in skuList"
      @click="onSelectSku(sku)"
      @deleteSku="onDeleteSku(sku.id)"
      :key="sku.id"
      :sku="sku"
    />
  </div>
  <div
    class="empty"
    v-else
  >
    <span>Новые подсчёты появятся здесь</span>
  </div>
</template>

<style scoped>
.articles-table {
  max-height: 389px;
  overflow-y: auto;
  width: 100%;
  scrollbar-width: thin;
  scrollbar-color: #CFCFCF transparent;
}

.empty {
  width: 100%;
  height: 500px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  color: #CFCFCF;
}

/* WebKit браузеры */
.articles-table::-webkit-scrollbar {
  width: 8px;
}

.articles-table::-webkit-scrollbar-track {
  background: transparent;
  border-radius: 4px;
}

.articles-table::-webkit-scrollbar-thumb {
  background: #4a90e2;
  border-radius: 4px;
}

.articles-table::-webkit-scrollbar-thumb:hover {
  background: #357abd;
}
</style>
