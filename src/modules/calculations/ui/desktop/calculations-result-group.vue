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
    class="calculations-result-group"
  >
    <div class="calculations-result-group__text-block">
      <div>
        <div class="calculations-result-group__row">
          <span>Итого без скидки:</span>
          <span>{{ resultWithoutDiscount }} ₽</span>
        </div>
        <div class="calculations-result-group__row">
          <span>Скидка на чек:</span>
          <span>{{ discountForAllPercent }}%</span>
        </div>
      </div>

      <div class="calculations-result-group__result u-bold">
        <span>Итого:</span>
        <span>{{ result }} ₽</span>
      </div>
    </div>

    <button
      @click="onSetDiscountForAll"
      type="button"
      :disabled="false"
      class="calculations-result-group__button btn btn-secondary"
    >
      Скидка на чек
    </button>
  </div>
</template>

<style scoped>
.calculations-result-group {
  display: flex;
  gap: 22px;
  flex-direction: column;
  margin-left: var(--spacing-sm);
}

.calculations-result-group__text-block {
  height: 130px;
  width: 200px;
  border-radius: var(--radius-md);
  padding: 20px;
  background-color: var(--color-background-secondary);
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.calculations-result-group__result {
  display: flex;
  justify-content: space-between;
  border-top: 1px solid #F4F5FA;
  padding-top: 15px;
}

.calculations-result-group__row {
  display: flex;
  justify-content: space-between;
  padding-bottom: 15px;
}
</style>
