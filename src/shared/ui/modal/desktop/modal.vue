<script lang="ts" setup>
import {
  computed,
} from 'vue'
import Modal from '@/shared/ui/modal/common/modal.vue'

const props = withDefaults(defineProps<{
  clickToClose?: boolean
  closeButtonTitle?: string
  crossToClose?: boolean
  escToClose?: boolean
  isLoading?: boolean
}>(), {
  // eslint-disable-next-line vue/no-boolean-default
  clickToClose: true,
  closeButtonTitle: '',
  // eslint-disable-next-line vue/no-boolean-default
  crossToClose: true,
  // eslint-disable-next-line vue/no-boolean-default
  escToClose: true,
  isLoading: false,
})

const emit = defineEmits<{
  (event: 'cancel'): void
  (event: 'close'): void
}>()

const slots = defineSlots<{
  default?: (props: {close: () => void}) => unknown
  footer?: (props: {close: () => void}) => unknown
  header?: (props: object) => unknown
  modalHeader?: (props: object) => unknown
}>()

const closeButtonTitle = computed(() => props.closeButtonTitle ?? 'Закрыть')

const onCrossClick = (close: () => void) => {
  if (props.crossToClose) {
    close()
  }
}
</script>

<template>
  <Modal
    v-slot="{cancel, close}"
    :clickToClose="clickToClose"
    :escToClose="escToClose"
    transition="modal"
    @cancel="emit('cancel')"
    @close="emit('close')"
    class="modal"
  >
    <div
      class="modal__content"
    >
      <span v-if="isLoading">is loading</span>
      <template v-else>
        <button
          v-if="crossToClose"
          :aria-label="closeButtonTitle"
          type="button"
          @click="onCrossClick(cancel)"
          class="modal__close"
        >
          <img
            src="@/shared/assets/icons/cross.svg"
            alt=""
          >
        </button>
        <div class="modal__inner">
          <slot name="modalHeader">
            <header
              v-if="'header' in slots"
            >
              <slot
                :close="close"
                name="header"
              />
            </header>
          </slot>

          <div
            v-if="'default' in slots"
            class="modal__body"
          >
            <slot
              :close="close"
            />
          </div>

          <div
            v-if="'footer' in slots"
          >
            <slot
              :close="close"
              name="footer"
            />
          </div>
        </div>
      </template>
    </div>
  </Modal>
</template>

<style scoped>
.modal {
  display: grid;
  justify-content: center;
  align-items: center;
}

.modal__content {
  background-color: #FFFFFF;
  border-radius: 8px;
  display: grid;
  min-width: 357px;
  color: #4C4C4C;
}

.modal__inner {
  padding: 22px;
}

.modal__inner header {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.modal__close {
  height: 25px;
  width: 25px;
  position: relative;
  background: transparent;
  border: none;
  cursor: pointer;
  justify-self: end;
  margin-bottom: -25px;
}

.modal__body {

}
</style>
