<script lang="ts" setup>
import {
  type TransitionProps,
  computed,
  reactive,
} from 'vue'
import {
  useModal,
} from '@/shared/ui/modal/common/modal.ts'

const props = withDefaults(defineProps<{
  clickToClose?: boolean
  escToClose?: boolean
  isCompact?: boolean
  transition?: TransitionProps | string
}>(), {
  // eslint-disable-next-line vue/no-boolean-default
  clickToClose: true,
  // eslint-disable-next-line vue/no-boolean-default
  escToClose: true,
  isCompact: false,
  transition: '',
})

const emit = defineEmits<{
  /**
   * Событие закрытия модалки при нажатии вне границ модалки, при нажатии на Esc, при нажатии на крест.
   * @todo Подумать над обработкой события покидания страницы и нататии на кнопку назад.
   */
  (event: 'cancel'): void
  (event: 'close'): void

  /** Модалка отрыта, анимация открытия завершена. */
  (event: 'opened'): void
  /** Модалка закрыта, анимация закрытия завершена. */
  (event: 'closed'): void
}>()

const slots = defineSlots<{
  default?: (props: {
    cancel: () => void
    close: () => void
  }) => unknown
}>()
debugger
const {modal} = useModal()

const dialog = reactive({
  afterEnter: () => {
    emit('opened')
  },
  afterLeave: () => {
    modal.unregister()
    emit('closed')
  },
  cancel: () => {
    emit('cancel')
    dialog.close()
  },
  close: () => modal.close(),
  isOpened: computed(() => modal.isOpened),
  /**
   * Не используется, т.к. обрабатывает не все состояния и делает это криво.
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog#closedby
   */
  // closedby: computed(() => {
  //   return props.clickToClose && props.escToClose
  //     ? 'any'
  //     : props.escToClose
  //       ? 'closerequest'
  //       : 'none'
  // }),
  onCancel: (event: Event) => {
    event.preventDefault()

    if (props.escToClose) {
      dialog.cancel()
    }
  },
  onClick: (event: MouseEvent) => {
    if (props.clickToClose && event.target === event.currentTarget) {
      dialog.cancel()
    }
  },
  onClose: (event: Event) => {
    emit('close')
  },
  onKeyDown: (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      event.preventDefault()

      if (props.escToClose) {
        dialog.cancel()
      }
    }
  },
  ref: ((element) => {
    if (element instanceof HTMLDialogElement) {
      modal.register(element)
    }
  }),
  transition: computed(() => typeof props.transition === 'string' ? {name: props.transition} : props.transition),
})
</script>

<template>
  <Transition
    v-bind="dialog.transition"
    @afterEnter="dialog.afterEnter"
    @afterLeave="dialog.afterLeave"
  >
    <dialog
      v-show="dialog.isOpened"
      :ref="dialog.ref"
      @cancel="dialog.onCancel"
      @click="dialog.onClick"
      @close="dialog.onClose"
      @keydown="dialog.onKeyDown"
      :class="isCompact ? 'u-z-100' : 'u-z-1000'"
    >
      <slot
        :cancel="dialog.cancel"
        :close="dialog.close"
      />
    </dialog>
  </Transition>
</template>
