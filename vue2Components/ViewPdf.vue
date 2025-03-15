<template>
  <div>
    <!-- pc端展示 -->
    <object
      v-if="isPc"
      class="view-pc-pdf"
      frameborder="0"
      type="application/pdf"
      :data="fileUrl"
    >
      <embed
        :src="fileUrl"
        type="application/pdf"
      >
    </object>
    <div v-else>
      <!-- h5展示 -->
      <canvas v-for="page in pdfPages" :id="`h5-canvas-pdf${page}`" :key="page"/>
    </div>
  </div>
</template>

<script>
import PDFJS from 'pdfjs-dist'
import axios from 'axios'
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry'

PDFJS.GlobalWorkerOptions.workerSrc = pdfjsWorker

export default {
  data() {
    return {
      title: '',
      pdfDoc: null,
      loading: false,
      pdfPages: 0,
    }
  },
  props: {
    isPc: true,
    fileUrl: {
      type: String,
      default: ''
    }
  },
  created() {
    !this.isPc && this.fileUrl && this.handlePdfFile(this.fileUrl)
  },
  methods: {
    renderPdfPage(num) {
      this.pdfDoc.getPage(num).then(page => {
        const canvas = document.getElementById(`'h5-canvas-pdf${ num}`)
        const canvasContext = canvas.getContext('2d')
        const pdfDpr = window.devicePixelRatio || 1
        const pdfBsr = canvasContext.webkitBackingStorePixelRatio
            || canvasContext.mozBackingStorePixelRatio
            || canvasContext.msBackingStorePixelRatio
            || canvasContext.oBackingStorePixelRatio
            || canvasContext.backingStorePixelRatio || 1
        const ratio = pdfDpr / pdfBsr
        const pdfViewport = page.getViewport(window.screen.availWidth / page.getViewport(1).width)
        canvas.width = pdfViewport.width * ratio
        canvas.height = pdfViewport.height * ratio
        canvas.style.width = `${pdfViewport.width }px`
        canvas.style.height = `${pdfViewport.height }px`
        canvasContext.setTransform(ratio, 0, 0, ratio, 0, 0)
        const renderContext = {
          canvasContext,
          viewport: pdfViewport
        }
        page.render(renderContext)
        if (this.pdfPages > num) {
          this.renderPdfPage(num + 1)
        }
        this.loading = false
      }, error => {
        this.loading = false
      })
    },
    // 处理url 转成blob
    async handlePdfFile(url) {
      this.loading = true
      try {
        const pdf = await axios({
          method: 'get',
          url,
          responseType: 'blob'
        })
        const blob = new Blob([pdf.data], { type: 'application/pdf' })
        const fileUrl = window.URL.createObjectURL(blob)
        this.loadPdfFile(fileUrl)
      } catch (err) {
        this.loading = false
      }
    },
    async loadPdfFile(url) {
      try {
        const pdf = await PDFJS.getDocument(url)
        this.pdfPages = this.pdfDoc.numPages
        this.pdfDoc = pdf
        this.$nextTick(() => {
          this.renderPdfPage(1)
        })
      } catch (error) {
        if (error.status === 403) {
          this.title = 'PDF文件无效，请重新获取'
          return
        }
        this.loading = false
      }
    }
  }
}
</script>

<style lang="less" scoped>
canvas {
  display: block;
  width: 100%;
  border-bottom: 1px solid #000;
}

.view-pc-pdf {
  width: 100%;
  height: 100%;
}
</style>
