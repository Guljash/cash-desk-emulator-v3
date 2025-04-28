<script setup lang="ts">
import {
  ref,
} from 'vue'
import CalculationsTable from '@/modules/calculations/ui/desktop/calculations-table.vue'
import {
  useAddSku,
} from '@/modules/calculations/application/use-add-sku.js'
import {
  get,
} from '@vueuse/core'
import {
  type SkuId,
} from '@/modules/calculations/domain/types.js'

const {addSku} = useAddSku()

const inputModeValue = ref('')

const onAddSku = (): void => {
  if (get(inputModeValue) === undefined) {
    return
  }
  addSku(parseInt(get(inputModeValue)) as SkuId, 1)
}

const instanceName = ref('Клиент 1')
</script>

<template>
  <main class="main-content">
    <div class="articles-block">
      <h2>{{ instanceName }}</h2>

      <CalculationsTable />

      <div class="input-form-wrapper">
        <div class="buttons-group">
          <button
            @click="onAddSku"
            type="button"
            class="btn btn-primary"
          >
            Добавить артикул
          </button>
          <button
            type="button"
            class="btn btn-secondary"
          >
            Изменить количество
          </button>
          <button
            type="button"
            class="btn btn-secondary"
          >
            Скидка по позиции
          </button>
          <button
            type="button"
            class="btn btn-secondary"
          >
            Скидка на чек
          </button>
        </div>

        <div class="input-group">
          <input
            v-model="inputModeValue"
            type="text"
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
