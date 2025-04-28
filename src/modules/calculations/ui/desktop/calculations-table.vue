<script setup lang="ts">
import SkuItem from '@/modules/calculations/ui/desktop/sku-item.vue'
import {
  useCalculationStore,
} from '@/modules/calculations/services/calculations-store-adapter.ts'

const {skuList} = useCalculationStore()
</script>

<template>
  <table class="articles-table">
    <thead>
      <tr>
        <th>Артикул</th>
        <th>Наименование</th>
        <th>Количество</th>
        <th>Цена</th>
        <th>Скидка</th>
        <th>Действия</th>
      </tr>
    </thead>
    <tbody>
      <SkuItem
        v-for="sku in skuList"
        :key="sku.id"
        :sku="sku"
      />
    </tbody>
  </table>
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
