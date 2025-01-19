<template>
  <div class="loading-dots">
    <span></span>
    <span></span>
    <span></span>
  </div>
</template>

<style scoped>
.loading-dots {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  gap: .3rem;
}

.loading-dots span {
  width: 10px;
  height: 8px;
  background-color: white;
  border-radius: 50%;
  animation: dots 1.5s infinite ease-in-out;
  opacity: 0;
}

.loading-dots span:nth-child(1) {
  animation-delay: 0s;
}

.loading-dots span:nth-child(2) {
  animation-delay: 0.3s;
}

.loading-dots span:nth-child(3) {
  animation-delay: 0.6s;
}

@keyframes dots {
  0%, 100% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
}
</style>
