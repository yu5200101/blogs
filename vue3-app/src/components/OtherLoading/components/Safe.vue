<template>
  <div class="safe">
    <p>安全loading</p>
    <CircleList />
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue'

const CircleList = defineAsyncComponent(() =>
  import('@/components/CircleList.vue')
)
</script>

<style lang="scss" scoped>
.safe {
  width: 260px;
  height: 218px;
  padding: 32px 0;

  img {
    width: 60px;
  }

  p {
    margin: 18px auto 12px;
  }
}
</style>
