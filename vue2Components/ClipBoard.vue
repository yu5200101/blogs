<!-- 父级组件必须加上样式 position: relative 此按钮占的位置就是父级元素的位置 -->
<template>
  <div class="clip-box">
    <div class="clip-box-btn" @click="handleClipboard" />
    <div
      ref="clipContentRef"
      class="clip-box-value"
    >
      {{ text }}
    </div>
  </div>
</template>

<script>
import Clipboard from 'clipboard'

export default {
  methods: {
    handleClipboard(event) {
      this.$emit('clickFn')
      const valueTarget = this.$refs.clipContentRef
      const successSite = event && valueTarget
      if (successSite) {
        const clipboard = new Clipboard(event.target, {
          target: () => valueTarget
        })
        clipboard.on('success', () => {
          clipboard.destroy()
        })
        clipboard.on('error', () => {
          clipboard.destroy()
        })
        clipboard.onClick(event)
      }
    }
  },
  props: {
    text: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="less" scoped>
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
