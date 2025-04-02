<template>
  <div class="about">
    <h1>404</h1>
  </div>
</template>
<script setup lang="ts">
import { onBeforeUnmount } from 'vue'
const pageReload = () => {
  const regExpRules = [new RegExp('/test')]
  if (regExpRules.some(reg => reg.test(window.location.href))) {
    window.location.reload()
  }
}
pageReload()

const visibilityFn = () => {
  if (document.visibilityState === 'visible') {
    pageReload()
  }
}

onBeforeUnmount(() => {
  window.removeEventListener('visibilitychange', visibilityFn)
})
window.addEventListener('visibilitychange', visibilityFn)

</script>

<style scoped>
.about {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  font-weight: bold;
}
@media (min-width: 1024px) {
  .about {
    display: flex;
    align-items: center;
    min-height: 100vh;
  }
}
</style>
