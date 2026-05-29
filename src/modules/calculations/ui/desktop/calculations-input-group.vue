<script setup lang="ts">
import {
  get,
  set,
} from '@vueuse/core'
import {
  useAddSku,
} from '@/modules/calculations/application/use-add-sku.ts'
import {
  useCalculationStore,
} from '@/modules/calculations/services/calculations-store-adapter.js'
import {
  useChangeMultiplier,
} from '@/modules/calculations/application/use-change-multiplier.ts'
import {
  useSetDiscount,
} from '@/modules/calculations/application/use-set-discount.js'
import {
  useInputGroup,
} from '@/modules/calculations/ui/common/use-input-group.js'
import {
  ref,
} from 'vue'

const inputField = ref<HTMLInputElement | undefined>(undefined)
const inputModelValue = defineModel<string>({required: true})

const {skuList, selectedSku} = useCalculationStore()
const {addSkuById} = useAddSku()
const {changeMultiplierById} = useChangeMultiplier()
const {setDiscount} = useSetDiscount()
const {
  withWrapper, isBtnDisabled,
} = useInputGroup(inputModelValue)

const onAddSku = (): void => {
  const rawInput = get(inputModelValue).trim()

  let idPart: string | undefined
  let multiplierPart: string | undefined

  if (rawInput.includes(',')) {
    [idPart, multiplierPart] = rawInput.split(',').map((part) => part.trim())
  } else {
    idPart = rawInput
    multiplierPart = undefined
  }

  const multiplier = multiplierPart ? parseFloat(multiplierPart) : 1

  addSkuById(idPart ?? '', multiplier)
}

const onNavigateSku = (direction: 'down' | 'up'): void => {
  if (get(selectedSku) === undefined) {
    return
  }

  const selectedSkuIndex = get(skuList).findIndex((sku) => sku.id === get(selectedSku)?.id)

  if (selectedSkuIndex === -1) {
    return
  }

  const getNewIndex = (): number => {
    const lastIndex = get(skuList).length - 1

    if (direction === 'down') {
      return selectedSkuIndex === lastIndex ? 0 : selectedSkuIndex + 1
    }

    return selectedSkuIndex === 0 ? lastIndex : selectedSkuIndex - 1
  }

  set(selectedSku, get(skuList).at(getNewIndex()))
}

const focus = (): void => {
  get(inputField)?.focus()
}

defineExpose({
  focus,
})
</script>

<template>
  <div class="sku-input">
    <div class="sku-input__group">
      <input
        @keydown.enter="withWrapper(onAddSku)"
        @keydown.prevent.+="withWrapper(() => changeMultiplierById(selectedSku?.id, parseInt(inputModelValue)))"
        @keydown.up="onNavigateSku('up')"
        @keydown.down="onNavigateSku('down')"
        @keydown.prevent.*="withWrapper(() => setDiscount(selectedSku?.id, parseInt(inputModelValue)))"
        v-model="inputModelValue"
        type="text"
        ref="inputField"
        class="sku-input__field"
        placeholder="Введите артикул или название товара"
      >
      <div class="sku-input__actions">
        <button
          @click="withWrapper(onAddSku)"
          :disabled="isBtnDisabled"
          type="button"
          class="btn btn-primary"
        >
          <img
            src="@/shared/assets/icons/sku.svg"
            alt=""
          >
          enter
        </button>
        <button
          @click="withWrapper(() => changeMultiplierById(selectedSku?.id, parseInt(inputModelValue)))"
          :disabled="isBtnDisabled"
          type="button"
          class="btn btn-primary"
        >
          <img
            src="@/shared/assets/icons/addMultiplier.svg"
            alt=""
          >
          +
        </button>
        <button
          @click="withWrapper(() => setDiscount(selectedSku?.id, parseInt(inputModelValue)))"
          type="button"
          :disabled="isBtnDisabled"
          class="btn btn-secondary"
        >
          <img
            src="@/shared/assets/icons/percent.svg"
            alt=""
          >
          *
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sku-input {
  margin-top: auto;
}

.sku-input__group {
  display: flex;
  gap: 10px;
}

.sku-input__field {
  flex: 1;
  padding: var(--spacing-sm, 10px);
  border: 1.5px solid var(--color-text-secondary);
  border-radius: var(--radius-md, 8px);
  height: 37px;
  max-width: 404px;
}

.sku-input__field:focus {
  outline: none;
  border-color: var(--color-accent);
}

.sku-input__field::placeholder {
  color: var(--color-text-secondary);
}

.sku-input__actions {
  display: flex;
  gap: var(--spacing-sm, 10px);
  align-items: center;
}
</style>
