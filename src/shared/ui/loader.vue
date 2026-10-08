<template>
  <div
    class="loader"
  >
    <div class="loader-spinner">
      <div class="loader-spinner__circle" />
    </div>
  </div>
</template>

<style scoped>
.loader {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  width: 100%;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(8px);
  border-radius: var(--radius-xl);
  padding: var(--spacing-xl);
}

.loader-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-md);
}

.loader-spinner__circle {
  width: 56px;
  height: 56px;
  border: 3px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  border-top-color: var(--color-accent);
  animation: spin 1.2s cubic-bezier(0.5, 0.1, 0.5, 0.9) infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
