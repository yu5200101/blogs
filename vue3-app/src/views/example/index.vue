<template>
  <div class="box">
    <div>{{count}}</div>
    <div>{{doubleCount}}</div>
    <van-button type="primary" @click="openLoading">openLoading</van-button>
    <van-button type="primary" @click="closeLoading">closeLoading</van-button>
    <van-button type="primary" @click="addCount">+count</van-button>
    <van-button type="primary" @click="clearCookie('token')">清除token-cookie</van-button>
    <van-field
      v-model="data"
      clearable
      label="key"
      placeholder="请输入key" />
    <van-button type="primary" @click="clearCookie">清除key-cookie</van-button>
    <van-button type="primary" @click="clearLocalStorage">清除key-localStorage</van-button>
    <van-button type="primary" @click="clearSessionStorage">清除key-sessionStorage</van-button>
    <van-button type="primary" @click="clearAllStorage">清除所有缓存</van-button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import storage from '@/utils/storage'
import { sleepTime } from '@/utils/tools'
import exampleStore from '@/stores/example'
import { setOtherLoading } from '@/components/OtherLoading'

const counterStore = exampleStore.counter()
const count = computed(() => counterStore.count)
const doubleCount = computed(() => counterStore.doubleCount)
const addCount = () => {
  counterStore.increment()
}
const closeLoading = () => {
  setOtherLoading(false)
}
const openLoading = async() => {
  setOtherLoading(true, 'new')
  await sleepTime(1)
  closeLoading()
}

const data = ref('')

const clearCookie = (type: string) => {
  storage.cookie.removeItem(type || data.value)
  showToast('清除成功')
}
const clearLocalStorage = () => {
  storage.localStorage.removeItem(data.value)
  showToast('清除成功')
}
const clearSessionStorage = () => {
  storage.sessionStorage.removeItem(data.value)
  showToast('清除成功')
}

const clearAllStorage = () => {
  storage.cookie.clear()
  storage.localStorage.clear()
  storage.sessionStorage.clear()
  showToast('清除成功')
}
</script>

<style lang="scss" scoped>
.box {
  display: flex;
  flex-flow: column;

  .van-button {
    width: 200px;
    margin: 5px;
  }
}
</style>
