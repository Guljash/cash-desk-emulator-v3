<script setup lang="ts">
import {
  RouterView,
} from 'vue-router'
import Sidebar from '@/widgets/sidebar.vue'
import '@/app/styles.css'
import ModalsContainer from '@/shared/ui/modal/common/modals-container.vue'
</script>

<template>
  <div class="wrapper">
    <ModalsContainer />
    <div class="container">
      <Sidebar />

      <RouterView />
    </div>
  </div>
</template>

<style scoped>
.wrapper{
  font-size: 12px;
  background-color: #F4F5FA;
  min-height: 100vh;
  display: grid;
  grid-template-rows: auto 1fr auto;
  grid-template-columns: 100%;
}

.container {
  display: grid;
  grid-template-columns: minmax(102px, 102px) 1fr;
  min-height: 100vh;
}
</style>
