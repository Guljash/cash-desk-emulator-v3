<script setup lang="ts">
import {
  RouterView,
} from 'vue-router'
import Sidebar from '@/widgets/sidebar.vue'
import Header from '@/widgets/header.vue'
import Footer from '@/widgets/footer.vue'
import '@/app/styles.css'
</script>

<template>
  <div class="wrapper">
    <Header />
    <div class="container">
      <Sidebar />

      <RouterView />
    </div>
    <Footer />
  </div>
</template>

<style scoped>
.wrapper{
  color: #333;
  background-color: #f9f9f9;
  min-height: 100vh;
  display: grid;
  grid-template-rows: auto 1fr auto;
  grid-template-columns: 100%;
}

.container {
  display: grid;
  grid-template-columns: minmax(200px, 250px) 1fr;
  min-height: calc(100vh - 120px);
}
</style>
