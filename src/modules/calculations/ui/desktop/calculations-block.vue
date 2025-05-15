<script setup lang="ts">
import {
  computed,
  nextTick,
  ref,
} from 'vue'
import {
  get,
  set,
} from '@vueuse/core'
import CalculationsTable from '@/modules/calculations/ui/desktop/calculations-table.vue'
import {
  useAddSku,
} from '@/modules/calculations/application/use-add-sku.ts'
import {
  type Sku,
} from '@/modules/calculations/domain/types.ts'
import {
  useCalculationStore,
} from '@/modules/calculations/services/calculations-store-adapter.js'
import {
  useChangeMultiplier,
} from '@/modules/calculations/application/use-change-multiplier.ts'
import {
  useDeleteSku,
} from '@/modules/calculations/application/use-delete-sku.js'
import {
  useSetDiscount,
} from '@/modules/calculations/application/use-set-discount.js'
import {
  useSyncSkuMap,
} from '@/modules/calculations/application/use-sync-sku-map-data.js'

const {skuList, selectedSku} = useCalculationStore()
const {addSkuById} = useAddSku()
const {changeMultiplierById} = useChangeMultiplier()
const {deleteSku} = useDeleteSku()
const {setDiscount, setDiscountForAll} = useSetDiscount()
const {isLoading} = useSyncSkuMap()

const inputField = ref<HTMLInputElement | undefined>(undefined)

const normalizeDecimalSeparator = (value: string): string => {
  const validationResult = value.match(/[0-9]*[.,]?[0-9]*/)

  return Array.isArray(validationResult) ? validationResult[0].replace(/\./g, ',') : ''
}

const inputModelValue = defineModel<string>({
  set(value) {
    return normalizeDecimalSeparator(value)
  },
  get(value) {
    return normalizeDecimalSeparator(value)
  },
  default: '',
})

const resetInputModelValue = (): void => {
  set(inputModelValue, '')
}

const result = computed(() => Math.round(get(skuList).reduce((sum, sku) => sum + sku.multiplier * sku.cost, 0)))
const isBtnDisabled = computed(() => get(inputModelValue) === '')

const withWrapper = <T extends () => void>(cb: T): void => {
  cb()

  resetInputModelValue()
}

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

  const id = parseInt(idPart ?? '')
  const multiplier = multiplierPart ? parseFloat(multiplierPart) : 1

  addSkuById(id, multiplier)
}

const onSelectSku = async (sku: Sku): Promise<void> => {
  set(selectedSku, sku)

  await nextTick()

  get(inputField)?.focus()
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
// const instanceName = ref('Клиент 1')
</script>

<template>
  <main
    class="main-content"
  >
    <div v-if="isLoading">
      loading...
    </div>
    <div
      v-else
      class="articles-block"
    >
      <!--      <h2>{{ instanceName }}</h2> -->

      <CalculationsTable
        @selectSku="onSelectSku"
        @deleteSku="(id) => withWrapper(() => deleteSku(id))"
      />

      <div class="input-form-wrapper">
        <div class="buttons-group">
          <button
            @click="withWrapper(onAddSku)"
            :disabled="isBtnDisabled"
            type="button"
            class="btn btn-primary"
          >
            Добавить артикул
          </button>
          <button
            @click="withWrapper(() => changeMultiplierById(selectedSku?.id, parseInt(inputModelValue)))"
            :disabled="isBtnDisabled"
            type="button"
            class="btn btn-secondary"
          >
            Изменить количество
          </button>
          <button
            @click="withWrapper(() => setDiscount(selectedSku?.id, parseInt(inputModelValue)))"
            type="button"
            :disabled="isBtnDisabled"
            class="btn btn-secondary"
          >
            Скидка по позиции
          </button>
          <button
            @click="withWrapper(() => setDiscountForAll(parseInt(inputModelValue)))"
            type="button"
            :disabled="isBtnDisabled"
            class="btn btn-secondary"
          >
            Скидка на чек
          </button>
          <span>
            Итого: {{ result }}
          </span>
        </div>

        <div class="input-group">
          <input
            @keydown.enter="withWrapper(onAddSku)"
            @keydown.prevent.+="withWrapper(() => changeMultiplierById(selectedSku?.id, parseInt(inputModelValue)))"
            @keydown.up="onNavigateSku('up')"
            @keydown.down="onNavigateSku('down')"
            v-model="inputModelValue"
            type="text"
            ref="inputField"
            class="input-field"
            placeholder="Введите артикул или название товара"
          >
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.articles-block {
  background: #fff;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  width: 1000px;
  height: 700px;
  display: flex;
  flex-direction: column;
}

.articles-block h2 {
  color: #444;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e0e0e0;
}

.input-group {
  display: flex;
  gap: 10px;
  margin-bottom: 1.5rem;
}

.input-field {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #d0d0d0;
  border-radius: 4px;
  font-size: 1rem;
}

.input-field:focus {
  outline: none;
  border-color: #2d2d2d;
}

.input-form-wrapper {
  margin-top: auto;
}

.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
}

.btn-primary {
  background-color: #2d2d2d;
  color: white;
}

.btn-primary:hover {
  background-color: #444;
}

.btn-secondary {
  background-color: #e0e0e0;
  color: #333;
}

.btn-secondary:hover {
  background-color: #d0d0d0;
}

.buttons-group {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
</style>
