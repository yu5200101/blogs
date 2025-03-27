<template>
  <van-popup
    v-model:show="wxPublicAccountShow"
    closeable
    position="bottom"
    round
    :style="{ height: '240px' }"
    @closed="wxPublicAccountClose">
    <div class="popup-title">{{ props.wxPublicAccountTitle }}</div>
    <div class="popup-content">
      <div class="popup-content-img">
        <div class="popup-content-img-box">
          <img :src="qrCodeUrl" alt="">
        </div>
        <div class="popup-content-img-box">
          <img src="https://gw.alicdn.com/bao/uploaded/i1/2207806982565/O1CN01zhc0gf1UoovIgIneq_!!2207806982565.jpg" alt="">
        </div>
      </div>
      <div class="popup-content-text">
        长按指纹，识别二维码
      </div>
    </div>
  </van-popup>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
const emits = defineEmits(['wxPublicAccountClose'])
const wxPublicAccountClose = () => {
  emits('wxPublicAccountClose', false)
}

const props = defineProps({
  wxPublicAccountShow: {
    type: Boolean,
    required: false,
    default: false
  },
  wxPublicAccountTitle: {
    type: String,
    required: false,
    default: '关注'
  },
  qrCodeUrl: {
    type: String,
    required: false,
    default: 'https://'
  }
})
const wxPublicAccountShow = ref(props.wxPublicAccountShow)
watch(() => props.wxPublicAccountShow, val => {
  wxPublicAccountShow.value = val
})
</script>
<style scoped lang="scss">
.popup-title{
  padding: 36px;
  font-size: 32px;
  font-weight: bold;
  text-align: center;
}

.popup-content {
  padding: 36px;

  &-img {
    display: flex;
    justify-content: center;

    &-box {
      width: 210px;
      height: 210px;
      padding: 0 20px;

      img {
        width: 100%;
      }
    }
  }

  &-text {
    font-size: 32px;
    font-weight: normal;
    text-align: center;
  }
}
</style>
