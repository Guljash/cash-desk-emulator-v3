<script lang="ts" setup>
import {
  modal,
  MODAL_PROVIDE_KEY,
} from '@/shared/ui/modal/common/modal.ts'
import Provide from '@/shared/utils/provide.vue'
</script>

<template>
  <div class="modals-container">
    <Provide
      v-for="modalItem in modal.openedModals"
      :key="modalItem.id"
      :modal="modalItem"
      :provideKey="MODAL_PROVIDE_KEY"
    >
      <Component
        :is="modalItem.options.component"
        :key="modalItem.id"
        v-bind="modalItem.options.bind"
        v-on="modalItem.options.on"
      >
        <template
          v-for="slot, name in modalItem.options.slots"
          :key="name"
          #[name]="props"
        >
          <Component
            :is="slot"
            v-if="typeof slot === 'function'"
            v-bind="props"
          />
          <span
            v-else
            v-html="slot"
          />
        </template>
      </Component>
    </Provide>
  </div>
</template>
