<!--
 * @Description: 父级组件必须加上样式 position: relative 此按钮占的位置就是父级元素的位置
-->
<template>
  <div class="clip-box">
    <div class="clip-box-btn" @click="handleClipboard" />
    <div ref="clipValueRef" class="clip-box-value">
      {{ props.text }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Clipboard from 'clipboard'
interface Props {
  text: string,
  successText?: string,
  failText?: string
}
const props = withDefaults(defineProps<Props>(), {
  text: '',
  successText: '',
  failText: ''
})
const clipValueRef = ref(null)
const emits = defineEmits(['clickFn'])
const handleClipboard = (event: Event) => {
  emits('clickFn')
  const valueTarget = clipValueRef.value
  const successSite = event && valueTarget
  if (successSite) {
    const clipboard = new Clipboard(event.target, {
      target: () => valueTarget
    })
    clipboard.on('success', () => {
      if (props.successText) {
        showToast({
          message: props.successText,
          duration: 1000
        })
      }
      clipboard.destroy()
    })
    clipboard.on('error', () => {
      if (props.failText) {
        showToast({
          message: props.failText
        })
      }
      clipboard.destroy()
    })
    clipboard.onClick(event)
  }
}
</script>

<style lang="scss" scoped>
.clip-box {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  &-btn {
    width: 100%;
    height: 100%;
  }

  &-value {
    position: absolute;
    top: -10000px;
    left: -10000px;
  }
}
</style>
