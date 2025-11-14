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
  <div class="articles-table">
    <SkuItem
      v-for="sku in skuList"
      @click="onSelectSku(sku)"
      @deleteSku="onDeleteSku(sku.id)"
      :key="sku.id"
      :sku="sku"
    />
  </div>
</template>

<style scoped>
.articles-block h2 {
  color: #444;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e0e0e0;
}

.articles-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1.5rem;
}

.articles-table th {
  background-color: #2d2d2d;
  color: #f0f0f0;
  padding: 0.75rem;
  text-align: left;
}
</style>
