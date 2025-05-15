<script setup lang="ts">
import CalculationsBlock from '@/modules/calculations/ui/desktop/calculations-block.vue'
import {
  useSyncSkuMap,
} from '@/modules/calculations/application/use-sync-sku-map-data.ts'
import {
  onMounted,
} from 'vue'

const {syncSkuMapData} = useSyncSkuMap()

onMounted(async () => {
  void syncSkuMapData()
})
</script>

<template>
  <CalculationsBlock />
</template>
