<template>
  <van-popup
    :show="props.wxSubscribeShow"
    position="bottom"
    round
    :style="{ height: '200px' }"
    :closeable="false">
    <div class="popup-title">
      <div class="popup-title-logo"> <img src="https://gw.alicdn.com/bao/uploaded/i1/2207806982565/O1CN01zhc0gf1UoovIgIneq_!!2207806982565.jpg" alt=""></div>
      <p>{{ props.wxSubscribeTitle }}</p>
    </div>
    <div class="popup-content">
      <div class="popup-content-text">{{wxSubscribeTips}}</div>
      <div class="popup-content-btn">
        <van-button
          type="default"
          size="large"
          square
          color="#02C160"
          plain
          block
          @click="wxSubscribeCancel">
        取消
        </van-button>
        <van-button
          type="primary"
          size="large"
          square
          color="#02C160"
          block>
        允许
        <wxSubscribe
        :templateIdList="props.templateIdList"
        @wxSubscribeSuccess="wxSubscribeSuccess"
        @wxSubscribeErr="wxSubscribeErr"/>
        </van-button>
      </div>
    </div>
  </van-popup>
</template>

<script lang="ts" setup>
import wxSubscribe from './wxSubscribe.vue'
import '@/lib/weixin'

const emits = defineEmits(['wxSubscribeCancel', 'wxSubscribeSuccess', 'wxSubscribeErr'])
const wxSubscribeCancel = () => {
  emits('wxSubscribeCancel')
}
const wxSubscribeSuccess = (res: any) => {
  emits('wxSubscribeSuccess', res)
}

const wxSubscribeErr = (err: any) => {
  emits('wxSubscribeErr', err)
}

const props = defineProps({
  wxSubscribeShow: {
    type: Boolean,
    required: false,
    default: false
  },
  wxSubscribeTitle: {
    type: String,
    required: false,
    default: '消息通知'
  },
  wxSubscribeTips: {
    type: String,
    required: false,
    default: '接收后您可以及时收到消息通知'
  },
  templateIdList: {
    type: String,
    required: true,
    default: ''
  }
})

</script>
<style scoped lang="scss">
.popup-title{
  display: flex;
  align-items: center;
  padding: 36px;
  font-size: 30px;

  &-logo{
    width: 60px;
    height: 60px;
    margin-right: 20px;

    img{
      width: 100%;
      height: 100%;
    }
  }
}

.popup-content {
  padding: 10px 36px;

  &-text{
    font-size: 32px;
    font-weight: bold;
  }

  &-btn{
    display: flex;
    justify-content: space-around;
    margin-top: 64px;

    .van-button{
      width: 230px;
      height: 86px;
      border-radius: 8px;
    }
  }
}
</style>
