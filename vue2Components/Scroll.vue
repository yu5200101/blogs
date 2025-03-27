<template>
  <div
    ref="wrapper"
    @touchstart="onStartFn"
    @touchmove.prevent="onMoveFn"
    @touchend="onEndFn"
    @touchcancel="onEndFn"
    @transitionend="onTransitionEndFn">
    <div ref="scroller" :style="scrollerStyle">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      minX: 0,
      maxX: 0,
      wrapperHeight: 0,
      wrapperWidth: 0,
      duration: 0,
      bezier: 'linear',
      pointX: 0, // touchStart 手势 x 坐标
      startX: 0, // touchStart 元素 x 偏移值
      offsetX: 0, // 元素实时 x 偏移值
      startTime: 0, // 惯性滑动范围内的 startTime
      momentumStartX: 0, // 惯性滑动范围内的 startX
      momentumTimeThreshold: 300, // 惯性滑动的启动 时间阈值
      momentumXThreshold: 15, // 惯性滑动的启动 距离阈值
      isStarted: false // start锁
    }
  },
  computed: {
    scrollerStyle() {
      return {
        transform: `translateX(${this.offsetX}px)`,
        'transition-duration': `${this.duration}ms`,
        'transition-timing-function': this.bezier
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.wrapperWidth = this.$refs.wrapper.offsetWidth
      this.minX = this.wrapperWidth - this.$refs.scroller.scrollWidth
    })
  },
  methods: {
    // 利用js正则取出translateX(-135.469px)里面的数字，答案为-135.469
    // 利用js正则取出translateX(135px)里面的数字，答案为135
    // 利用js正则取出translateX(-135px)里面的数字，答案为-135
    // 利用js正则translateX(135.3333px)里面的数字，答案为135.3333
    extractNumber(inputString) {
      const regex = /[-+]?\d*\.\d+|[-+]?\d+/g
      const matches = inputString.match(regex)
      if (matches && matches.length > 0) {
        return parseFloat(matches[0])
      }
      return 0
    },
    // 超出边界时需要重置位置
    isNeedReset() {
      let offsetX
      if (this.offsetX < this.minX) {
        offsetX = this.minX
      } else if (this.offsetX > this.maxX) {
        offsetX = this.maxX
      }
      if (typeof offsetX !== 'undefined') {
        this.offsetX = offsetX
        this.duration = 500
        this.bezier = 'cubic-bezier(.165, .84, .44, 1)'
        return true
      }
      return false
    },
    // 停止滚动
    stop() {
      this.offsetX = this.extractNumber(this.$refs.scroller.style.transform)
    },
    momentum(current, start, duration) {
      const durationMap = {
        noBounce: 2500,
        weekBounce: 800,
        strongBounce: 400
      }
      const bezierMap = {
        noBounce: 'cubic-bezier(.17, .89, .45, 1)',
        weekBounce: 'cubic-bezier(.25, .46, .45, .94)',
        strongBounce: 'cubic-bezier(.25, .46, .45, .94)'
      }
      let type = 'noBounce'
      // 惯性滑动加速度
      const deceleration = 0.003
      // 回弹阻力
      const bounceRate = 10
      // 强弱回弹的分割值
      const bounceThreshold = 300
      // 回弹的最大限度
      const maxOverflowX = this.wrapperHeight / 6
      let overflowX

      const distance = current - start
      const speed = 2 * Math.abs(distance) / duration
      let destination = current + speed / deceleration * (distance < 0 ? -1 : 1)
      if (destination < this.minX) {
        overflowX = this.minX - destination
        type = overflowX > bounceThreshold ? 'strongBounce' : 'weekBounce'
        destination = Math.max(this.minX - maxOverflowX, this.minX - overflowX / bounceRate)
      } else if (destination > this.maxX) {
        overflowX = destination - this.maxX
        type = overflowX > bounceThreshold ? 'strongBounce' : 'weekBounce'
        destination = Math.min(this.maxX + maxOverflowX, this.maxX + overflowX / bounceRate)
      }

      return {
        destination,
        duration: durationMap[type],
        bezier: bezierMap[type]
      }
    },
    onStartFn(e) {
      const point = e.touches ? e.touches[0] : e
      this.isStarted = true
      this.duration = 0
      this.stop()
      this.pointX = point.clientX
      this.startX = this.offsetX
      this.momentumStartX = this.startX
      this.startTime = new Date().getTime()
    },
    onMoveFn(e) {
      if (!this.isStarted) return
      const point = e.touches ? e.touches[0] : e
      const deltaX = point.clientX - this.pointX
      this.offsetX = Math.round(this.startX + deltaX)
      const now = new Date().getTime()
      // 记录在触发惯性滑动条件下的偏移值和时间
      if (now - this.startTime > this.momentumTimeThreshold) {
        this.momentumStartX = this.offsetX
        this.startTime = now
      }
    },
    onEndFn() {
      if (!this.isStarted) return
      this.isStarted = false
      if (this.isNeedReset()) return
      const absDeltaX = Math.abs(this.offsetX - this.momentumStartX)
      const duration = new Date().getTime() - this.startTime
      // 启动惯性滑动
      if (duration < this.momentumTimeThreshold && absDeltaX > this.momentumXThreshold) {
        const momentum = this.momentum(this.offsetX, this.momentumStartX, duration)
        this.offsetX = Math.round(momentum.destination)
        this.duration = momentum.duration
        this.bezier = momentum.bezier
      }
    },
    onTransitionEndFn() {
      this.isNeedReset()
    }
  }
}
</script>
