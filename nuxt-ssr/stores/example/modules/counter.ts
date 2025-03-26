export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const doubleCount = computed(() => count.value * 2)
  const increment = () => {
    count.value++
  }

  return { count, doubleCount, increment }
})
/*
在/stores/example/modules定义了两个文件，第一个文件是counter.ts,里面有export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const doubleCount = computed(() => count.value * 2)
  const increment = () => {
    count.value++
  }

  return { count, doubleCount, increment }
})
第二个文件是init.ts,里面有
export const useInitStore = defineStore('init', () => {
  const initCount = ref(0)
  const doubleCount = computed(() => initCount.value * 2)
  const increment = () => {
    initCount.value++
  }

  return { initCount, doubleCount, increment }
})

如何在/stores/example/index.ts 针对/stores/example/modules里面的内容进行动态批量导出以便在vue文件直接通过
import exampleStore from '~/stores/example'
const counterStore = exampleStore.counter()
counterStore.count能拿到/stores/example/modules/counter.ts里面useCounterStore.count的值

*/