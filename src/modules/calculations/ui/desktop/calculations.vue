<script setup lang="ts">
import CalculationsBlock from '@/modules/calculations/ui/desktop/calculations-block.vue'
import {
  useCalculationStore,
} from '@/modules/calculations/services/calculations-store-adapter.ts'
import {
  useLoadSkuDb,
} from '@/modules/calculations/application/use-load-sku-db.ts'
import {
  onMounted,
} from 'vue'

const {skuDb} = useCalculationStore()
const {loadSkuDb} = useLoadSkuDb()

onMounted(async () => {
  void loadSkuDb()
})
</script>

<template>
  <CalculationsBlock />
</template>
