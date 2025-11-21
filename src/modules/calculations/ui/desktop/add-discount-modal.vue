<script setup lang="ts">
import Modal from '@/shared/ui/modal/desktop/modal.vue'
import {
  useSetDiscount,
} from '@/modules/calculations/application/use-set-discount.js'
import {
  useInputGroup,
} from '@/modules/calculations/ui/common/use-input-group.js'
import {
  modal,
} from '@/shared/ui/modal/common/modal.ts'
import {
  get,
} from '@vueuse/core'

const inputModel = defineModel<string>({default: ''})

const {withWrapper} = useInputGroup(inputModel)
const {setDiscountForAll} = useSetDiscount()

const onSubmit = (): void => {
  withWrapper(() => setDiscountForAll(Number(get(inputModel))))

  modal.hide('addDiscountModal')
}
</script>

<template>
  <Modal>
    <template #header>
      <h2>
        Введите скидку
      </h2>
    </template>
    <div>
      <form @submit.prevent="onSubmit">
        <input
          v-model="inputModel"
          type="text"
          class="input-field w100"
          placeholder="Введите скидку"
        >
        <button
          type="submit"
          class="btn btn-primary w100"
        >
          Применить
        </button>
      </form>
    </div>
  </Modal>
</template>

<style scoped>
.input-field {
  flex: 1;
  padding: 10px;
  border: 1.5px solid #CFCFCF;
  border-radius: 8px;
  max-width: 404px;
  height: 37px;
  display: block;
  margin-bottom: 20px;
}

.input-field:focus {
  outline: none;
  border-color: #1D9AFC;
}

.input-field::placeholder {
  color: #CFCFCF;
}
</style>
