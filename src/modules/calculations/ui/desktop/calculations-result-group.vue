<script setup lang="ts">
import {
  get,
} from '@vueuse/core'
import {
  useCalculationStore,
} from '@/modules/calculations/services/calculations-store-adapter.js'
import {
  computed,
} from 'vue'
import type {
  Sku,
} from '@/modules/calculations/domain/types.js'
import {
  useSkuMapStore,
} from '@/shared/services/sku-map-store-adapter.js'
import {
  modal,
} from '@/shared/ui/modal/common/modal.ts'
import AddDiscountModal from '@/modules/calculations/ui/desktop/add-discount-modal.vue'

const {skuMap} = useSkuMapStore()
const {skuList, discountForAllPercent} = useCalculationStore()

const calculateTotal = (calculateItemCost: (sku: Sku) => number) => {
  return computed(() => {
    const total = get(skuList).reduce((sum, sku) => sum + calculateItemCost(sku), 0)
    return Math.round(total * 2) / 2
  })
}

const result = calculateTotal((sku: Sku) => sku.multiplier * sku.cost)

const resultWithoutDiscount = calculateTotal((sku: Sku) => {
  return sku.multiplier * get(skuMap).get(sku.id)!.cost
})

const onSetDiscountForAll = () => {
  modal.show({
    name: 'addDiscountModal',
    component: AddDiscountModal,
  })
}
</script>

<template>
  <div
    v-show="skuList.length > 0"
    class="final-group"
  >
    <div class="text-block">
      <div>
        <div>
          <span>Итого без скидки:</span>
          <span>{{ resultWithoutDiscount }} ₽</span>
        </div>
        <div>
          <span>Скидка на чек:</span>
          <span>{{ discountForAllPercent }}%</span>
        </div>
      </div>
      <div class="result u-bold">
        <span>Итого:</span>
        <span>{{ result }} ₽</span>
      </div>
    </div>
    <button
      @click="onSetDiscountForAll"
      type="button"
      :disabled="false"
      class="btn btn-secondary"
    >
      Скидка на чек
    </button>
  </div>
</template>

<style scoped>
.final-group {
  display: flex;
  gap: 22px;
  flex-direction: column;
  margin-left: 10px;
}

.final-group .text-block {
  height: 130px;
  width: 200px;
  border-radius: 8px;
  padding: 20px;
  background-color: #FFFFFF;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.final-group .text-block .result {
  display: flex;
  justify-content: space-between;
  border-top: 1px solid #F4F5FA;
  padding-top: 15px;
}

.final-group .text-block div div {
  display: flex;
  justify-content: space-between;
  padding-bottom: 15px;
}
</style>
