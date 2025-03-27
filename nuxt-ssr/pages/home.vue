<template>
  <div class="">
    home
    <div>{{ count }}</div>
    <div>{{ doubleCount }}</div>
    <button @click="add">增加</button>
    <Child />
  </div>
</template>

<script setup lang="ts">
import { useCounterStore } from '~/stores/example/modules/counter'
const countStore = useCounterStore()
const count = computed(() => countStore.count)
const doubleCount = computed(() => countStore.doubleCount)

const add = () => {
  countStore.increment()
}
const Child = defineAsyncComponent(() => import('./components/Child.vue'));
</script>

<style lang="scss" scoped>
</style>
