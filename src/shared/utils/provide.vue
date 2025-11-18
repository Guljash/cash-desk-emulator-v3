<script lang="ts" setup>
import {
  type InjectionKey,
  provide,
  useAttrs,
} from 'vue'

defineOptions({
  inheritAttrs: false,
})

const attrs = useAttrs()

const props = defineProps<{
  provideKey: InjectionKey<unknown>
}>()

provide(props.provideKey, attrs)
</script>

<template>
  <slot />
</template>
