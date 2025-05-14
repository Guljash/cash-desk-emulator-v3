<script setup lang="ts">
import CalculationsBlock from '@/modules/calculations/ui/desktop/calculations-block.vue'
import {
  useLoadSkuDb,
} from '@/modules/calculations/application/use-load-sku-db.ts'
import {
  onMounted,
} from 'vue'
import {
  get,
} from '@vueuse/core'
import {
  useCalculationStore,
} from '@/modules/calculations/services/calculations-store-adapter.js'

const {skuMap} = useCalculationStore()
const {loadSkuDb} = useLoadSkuDb()

onMounted(async () => {
  if (get(skuMap).size > 0) {
    return
  }

  void loadSkuDb()
})
</script>

<template>
  <CalculationsBlock />
</template>
