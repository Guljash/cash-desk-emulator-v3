<template>
  <header class="header">
    <div class="logo">
      Калькулятор
    </div>
    <div class="user-profile">
      <span>Пользователь</span>
      <div class="avatar" />
    </div>
  </header>
</template>

<style scoped>
.header {
  grid-column: 1 / -1;
  background-color: #2d2d2d; /* Темно-серый */
  padding: 1rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #f0f0f0;
}
.logo {
  font-weight: bold;
  font-size: 1.2rem;
  color: #f0f0f0;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #f0f0f0;
}

.avatar {
  width: 32px;
  height: 32px;
  background-color: #555;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: bold;
}
</style>
