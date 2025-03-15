<template>
  <div>
    <video
      ref="video"
      playsinline
      x5-playsinline
      raw-controls
      controls360
      webkit-playsinline
      x5-video-player-type="h5"
      x5-video-orientation="portraint"
      :src="videoUrl"
      :poster="videoImgSrc"
      @ended="playEnded"
      @loadedmetadata="loaded"
      @playing="videoPlaying"
    />
    <canvas
      :width="width"
      :height="height"
      ref="canvasRef"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      width: 0,
      height: 0,
      videoUrl: '',
      videoImgSrc: '',
      // 绘制视频id
      canvasRefAnimationFrameId: ''
    }
  },
  mounted() {
    this.drawVideo()
  },
  destroyed() {
    this.cancelDrawVideo()
  },
  methods: {
    playEnded() {
      this.$refs.video.currentTime = 0
    },
    videoPlaying() {
    },
    loaded() {},
    cancelDrawVideo() {
      // 取消动画帧的绘制
      clearTimeout(this.canvasRefAnimationFrameId)
    },
    async drawVideo() {
      await this.$nextTick()
      // 获取 video 元素和 canvas 元素
      const canvas = this.$refs.canvasRef
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      const { video } = this.$refs

      const drawFrame = () => {
        try {
          // 检查视频是否处于播放状态
          if (!video.paused && !video.ended) {
            // 在 largeCanvas 上绘制当前视频帧
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
            // 递归调用，实现动画效果
            this.canvasRefAnimationFrameId = setTimeout(drawFrame, 1000 / 60)
          }
        } catch (error) {}
      }
      // 开始绘制第一帧
      drawFrame()
    }
  }
}
</script>
