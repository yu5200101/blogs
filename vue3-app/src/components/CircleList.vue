<template>
  <div class="circle-list">
    <div class="circle" />
    <div class="circle" />
    <div class="circle" />
  </div>
</template>

<style lang="scss" scoped>
@keyframes shark {
  0% {
    opacity: 0.4;
  }

  50% {
    opacity: 1;
  }

  100% {
    opacity: 0.4;
  }
}

.circle-list{
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 88px;
  margin: 20px auto 0;

  .circle {
    width: 16px;
    height: 15px;
    background: #ffffff;
    border-radius: 8px;
    animation: shark 1.2s infinite ease-in-out;
  }

  .circle:nth-child(2) {
    animation-delay: 0.4s;
  }

  .circle:nth-child(3) {
    animation-delay: 0.8s;
  }
}

</style>
