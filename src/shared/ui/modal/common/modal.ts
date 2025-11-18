import {
  type Component,
  type DefineComponent,
  type InjectionKey,
  type VNode,
  inject,
  markRaw,
  reactive,
  ref,
  shallowReactive,
} from 'vue'
import {
  set,
} from '@vueuse/core'
import {
  type IsEmptyObject,
  type PartialOnUndefinedDeep,
  type Promisable,
} from 'type-fest'
import {
  type ComponentEmits,
  type ComponentProps,
} from '@/shared/utils/vue.ts'
import {
  uniqueId,
} from '@/shared/utils/unique-id.ts'

export const MODAL_PROVIDE_KEY: InjectionKey<{
  modal: Modal
}> = Symbol('modal')

export const useModal = () => inject(MODAL_PROVIDE_KEY)!

export type ModalOptions<T extends Component | DefineComponent> =
  & PartialOnUndefinedDeep<{
    /**
     * bind props and attrs to modal
     * @todo Оборачивать в `reactive` автоматически?
     */
    bind?: Component extends T
      ? Record<string, unknown>
      : DefineComponent extends T
        ? Record<string, unknown>
        : IsEmptyObject<ComponentProps<T>> extends true
          ? undefined
          : ComponentProps<T>
    /**
     * register events to modal
     */
    on?: Component extends T
      ? Record<string, Function>
      : DefineComponent extends T
        ? Record<string, Function>
        : IsEmptyObject<ComponentEmits<T>> extends true
          ? undefined
          : ComponentEmits<T>
  }>
  & {
    /**
     * modal component
     */
    component: Promisable<T>
    /**
     * Название модалки.
     */
    name?: string | undefined
    /**
     * modal component slot
     *
     * @example
     * ```js
     * {
     *   slot: {
     *     default: {
     *       component: 'RegistedComponentName'
     *       bind: {
     *         yourPropsKey: propsValue
     *       }
     *     }
     *   }
     * }
     * ```
     *
     * @example
     * ```js
     * {
     *   slot: {
     *     default: 'pure string'
     *   }
     * }
     * ```
     */
    slots?: Record<string, (() => VNode)[] | (() => VNode[])[] | string[] | undefined[] | string | (() => VNode) | (() => VNode[]) | undefined> // ComponentSlots<T>
    /**
     * Костыль для открытия меню в мобильной версии сайта.
     * @deprecated
     */
    withoutOverlay?: boolean
  }

export interface Modal {
  readonly id: string
  readonly isOpened: boolean
  readonly options: ModalOptions<Component>

  close: () => void
  open: () => void
  register: (element: HTMLDialogElement) => void
  unregister: () => void
}

export interface ModalManager {
  readonly openedModals: readonly Modal[]

  hide: (idOrName: string) => Promise<void>
  hideAll: () => Promise<void>
  show: <T extends Component | DefineComponent>(options: ModalOptions<T>) => Promise<void>
}

const openedModals: Modal[] = shallowReactive([])

/**
 * Порядок работы:
 * 1. modal.show()
 * 2. modal.register()
 * 3. modal.hide()
 * 4. modal.onClose()
 *
 * @todo Переименовать в `modalManager`.
 */
export const modal: ModalManager = {
  openedModals,

  hide: async (idOrName) => {
    const self = openedModals.findLast((it) => it.id === idOrName || it.options.name === idOrName)
    self?.close()
  },
  hideAll: async () => {
    await Promise.all(openedModals.map((it) => it.close()))
  },
  show: async (options) => {
    // @ts-expect-error
    options.bind ??= {}
    // @ts-expect-error
    options.on ??= {}
    options.slots ??= {}
    options.component = markRaw(options.component)

    const {promise, resolve} = Promise.withResolvers<void>()
    const isOpened = ref(false)
    let element: HTMLDialogElement | undefined

    const self: Modal = reactive({
      id: uniqueId('modal-'),
      isOpened,
      options: options as ModalOptions<Component>,

      close: () => {
        /** @todo Скорее всего нет смысла проверять `isConnected`. */
        if (element?.isConnected) {
          /**
           * @note В Safari возникают ошибки.
           * @see https://github.com/willmcpo/body-scroll-lock
           */
          // enableBodyScroll(element)
          /** Закрываем модалку вручную, чтобы отработало событие `close`. */
          element.close()
          set(isOpened, false)
        }
      },
      open: () => {
        if (element?.isConnected) {
          if (self.options.withoutOverlay === true) {
            element.show()
          } else {
            element.showModal()
          }
          // disableBodyScroll(element)
          set(isOpened, true)
        }
      },
      register: (el: HTMLDialogElement) => {
        if (!element?.isConnected) {
          element = el
          self.open()
        }
      },
      unregister: () => {
        const index = openedModals.indexOf(self)
        openedModals.splice(index, 1)
        element = undefined
        resolve()
      },
    })
    openedModals.push(self)
    return promise
  },
}
