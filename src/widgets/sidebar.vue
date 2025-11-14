<script setup lang="ts">
import {
  ref,
} from 'vue'

</script>

<template>
  <aside class="sidebar-wrapper">
<!--    <nav>-->
<!--      <div class="menu-item active">Главная</div>-->
<!--      <div class="menu-item">Проекты</div>-->
<!--      <div class="menu-item">Задачи</div>-->
<!--      <div class="menu-item">Календарь</div>-->
<!--      <div class="menu-item">Настройки</div>-->
<!--      <div class="menu-item">Помощь</div>-->
<!--    </nav>-->
  </aside>
</template>

<style scoped>
.sidebar-wrapper {
  background-color: #FFFFFF;
  padding: 1.5rem 1rem;
  border-right: 1px solid #d0d0d0;
  transition: transform 0.3s ease;
}

.menu-item {
  padding: 0.8rem 1rem;
  margin-bottom: 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.menu-item:hover {
  background-color: #d0d0d0;
  color: #222;
}

.menu-item.active {
  background-color: #c0c0c0;
  font-weight: 500;
}
</style>
