<template>
  <div class="other-loading">
    <van-popup
      v-model:show="visible"
      round
      :lazy-render="false"
      :close-on-click-overlay="false">
      <component class="content" :is="loadingTypeName"/>
    </van-popup>
  </div>
</template>

<script setup lang="ts">
import { ref, defineAsyncComponent, defineExpose } from 'vue'
import { showLoading, hideLoading } from '@/components/loading'

const Safe = defineAsyncComponent(() =>
  import('./components/Safe.vue')
)

const libType: {
  [key: string]: any
} = {
  'safe': Safe
}

const loadingType: string = 'safe'
const visible = ref(false)
const loadingTypeName = libType[loadingType as keyof typeof libType]

const show = (type: string) => {
  if (type === 'new') {
    hideLoading()
    visible.value = true
    return
  }
  showLoading('请稍后')
}

const close = () => {
  hideLoading()
  visible.value = false
}

defineExpose({
  show,
  close
})

</script>
<style lang="scss" scoped>
.other-loading {
  :deep(.van-popup) {
    position: fixed;
    top: 45%;
    text-align: center;
    border: none;
    background-color: transparent;
    z-index: 9000 !important;
  }

  .content {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    font-size: 28px;
    color: #ffffff;
    background-color: rgba(0, 0, 0, .8);
  }
}
</style>