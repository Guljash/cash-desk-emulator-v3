import {
  computed,
  type ComputedRef,
  type ModelRef,
} from 'vue'
import {
  get,
  set,
} from '@vueuse/core'

interface UseAddSku {
  inputModelValue: ModelRef<string>
  isBtnDisabled: ComputedRef<boolean>
  withWrapper: (cb: () => void) => void
}

export const useInputGroup = (inputModelValue: ModelRef<string>): UseAddSku => {
  const resetInputModelValue = (): void => {
    set(inputModelValue, '')
  }

  const withWrapper = <T extends () => void>(cb: T): void => {
    cb()

    resetInputModelValue()
  }

  const isBtnDisabled = computed(() => get(inputModelValue) === '')

  return {
    inputModelValue,
    withWrapper,
    isBtnDisabled,
  }
}
