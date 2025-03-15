<template>
  <div
    :class="['move-box', {
      transition: showTransition
    }]"
    ref="moveBoxRef"
    :style="{
      left: `${left}px`,
      top: `${top}px`
    }"
    @touchstart.stop="onStartFn"
    @touchmove.stop.prevent="onMoveFn"
    @touchend.stop="onEndFn"
    @touchcancel.stop="onEndFn"
  >
    <slot name="content" />
  </div>
</template>

<script>
import Vue from 'vue'

export default {
  data() {
    return {
      minL: 0,
      maxL: 0,
      minT: 0,
      maxT: 0,
      // start锁
      isStarted: false,
      // 距离左边的距离
      left: 0,
      // 距离顶部的距离
      top: 0,
      // touchstart 距离litterVideo左边的距离
      diffL: 0,
      // touchstart 距离litterVideo上边的距离
      diffT: 0,
      // 一半的宽度
      halfWidth: 0,
      // 过渡动画
      showTransition: false
    }
  },
  props: {
    safetyWidth: {
      type: Number,
      default: 0
    },
    position: {
      type: String,
      default: 'left'
    },
    defaultTop: {
      type: Number,
      default: 0
    },
    init: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    init: {
      handler() {
        this.initPosition()
      },
      immediate: true
    }
  },
  methods: {
    async initPosition() {
      await this.$nextTick()
      const offsetWidth = lodash.get(this.$refs, 'moveBoxRef.offsetWidth')
      const offsetHeight = lodash.get(this.$refs, 'moveBoxRef.offsetHeight')
      this.top = this.defaultTop
      this.left = this.safetyWidth
      this.minL = this.safetyWidth
      this.minT = this.safetyWidth
      this.maxL = document.body.offsetWidth - offsetWidth - this.safetyWidth
      this.maxT = document.body.offsetHeight - offsetHeight - this.safetyWidth
      if (this.position === 'right') {
        this.left = this.maxL
      }
      this.halfWidth = document.body.offsetWidth / 2
    },
    onStartFn(element) {
      // 动画中，不移动
      if (this.showTransition) return
      this.isStarted = true
      const point = element.touches ? element.touches[0] : element
      this.diffL = point.clientX - this.left
      this.diffT = point.clientY - this.top
    },
    onMoveFn: Vue.lodash.throttle(function (element) {
      // 动画中，不移动
      if (this.showTransition) return
      // start锁，不移动
      if (!this.isStarted) return
      const point = element.touches ? element.touches[0] : element
      let originLeft = point.clientX - this.diffL
      originLeft = originLeft < this.minL ? this.minL : originLeft
      originLeft = originLeft > this.maxL ? this.maxL : originLeft
      this.left = originLeft
      let originTop = point.clientY - this.diffT
      originTop = originTop < this.minT ? this.minT : originTop
      originTop = originTop > this.maxT ? this.maxT : originTop
      this.top = originTop
    }),
    onEndFn() {
      // start锁，不移动
      if (!this.isStarted) return
      // 添加过渡动画
      this.showTransition = true
      this.isStarted = false
      if ((this.left + this.diffL) > this.halfWidth) {
        this.left = this.maxL
      } else {
        this.left = this.safetyWidth
      }
      // 删除过渡动画
      setTimeout(() => {
        this.showTransition = false
      }, 300)
    }
  }
}
</script>

<style lang="less" scoped>
.move-box {
  position: fixed;

  &.transition {
    transition: all 0.3s;
  }
}
</style>
