/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  type AllowedComponentProps,
  type ComponentCustomProps,
  type Ref,
  type VNodeProps,
  type VNodeRef,
} from 'vue'
import {
  type LooseRequired,
} from '@vue/shared'
import {
  type Simplify,
  type Writable,
} from 'type-fest'

export type VNodeRefFn = Exclude<VNodeRef, Ref | string>

type DefinePropsCore<T, BKeys extends keyof T> = Readonly<Required<Record<BKeys, boolean>>> & Readonly<T>
type BooleanKey<T, K extends keyof T = keyof T> = K extends any ? [T[K]] extends [boolean | undefined] ? K : never : never

type NotUndefined<T> = T extends undefined ? never : T
export type InferDefaults<T> = {
  [K in keyof T]?: InferDefault<T, T[K]>;
}
type NativeType = Function | boolean | number | string | symbol | null
type InferDefault<P, T> = ((props: P) => T & {}) | (T extends NativeType ? T : never)
type PropsWithDefaults<T, Defaults extends InferDefaults<T>, BKeys extends keyof T> = Readonly<Omit<T, keyof Defaults>> & {
  readonly [K in BKeys]-?: K extends keyof Defaults ? Defaults[K] extends undefined ? boolean | undefined : boolean : boolean;
} & {
  readonly [K in keyof Defaults]-?: K extends keyof T ? Defaults[K] extends undefined ? T[K] : NotUndefined<T[K]> : never;
}

export type DefineProps<TypeProps> = DefinePropsCore<LooseRequired<TypeProps>, BooleanKey<TypeProps>>
export type WithDefaults<T, Defaults extends InferDefaults<T>> = PropsWithDefaults<T, Defaults, BooleanKey<T>>

export type ComponentBind<T> = Writable<OmitComponentBind<T extends new () => {$props: infer P}
  ? NonNullable<P>
  : T extends (props: infer P, ...args: any) => any
    ? P
    : {}>>

export type ComponentSlots<T> = T extends new () => {$slots: infer S}
  ? NonNullable<S>
  : T extends (props: any, ctx: {attrs: any; emit: any; slots: infer S}, ...args: any) => any
    ? NonNullable<S>
    : {}

export type ComponentEmit<T> = T extends new () => {$emit: infer E}
  ? NonNullable<E>
  : T extends (props: any, ctx: {attrs: any; emit: infer E; slots: any}, ...args: any) => any
    ? NonNullable<E>
    : {}

export type ComponentProps<T> = Simplify<OmitEventHandlers<ComponentBind<T>>>

export type ComponentEmits<T> = Simplify<RemoveOnPrefix<Omit<ComponentBind<T>, keyof ComponentProps<T>>>>

export type OmitComponentBind<T> = Omit<T, keyof (AllowedComponentProps & ComponentCustomProps & VNodeProps)>

export type OmitEventHandlers<T> = {
  [K in keyof T as K extends `on${string}`
    ? undefined extends T[K]
      ? ((...args: any[]) => void) extends T[K]
        ? never
        : K
      : K
    : K]: T[K];
}

type RemoveOnPrefix<T> = {
  [K in keyof T as K extends `on${infer Rest}` ? Uncapitalize<Rest> : K]: T[K];
}
