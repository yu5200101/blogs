<template>
  <div class="dialog-content">
    <div class="close" @click="close">关闭</div>
    <div class="content">
      <slot name="header" />
      <img
        v-if="typeof props.topBanner === 'string' && props.topBanner"
        class="content-img"
        :src="props.topBanner"
        alt="" />
      <van-swipe
        v-if="Array.isArray(props.topBanner)"
        :autoplay="3000"
        @change="onChange"
        lazy-render>
        <van-swipe-item v-for="(image, index) in props.topBanner" :key="index">
          <img v-if="image" class="content-img" :src="image" />
        </van-swipe-item>
        <template #indicator>
          <div class="custom-indicator">{{ current + 1 }}/{{ props.topBanner.length }}</div>
        </template>
      </van-swipe>
      <slot />
      <div class="content-btn">
        <div
          :class="[
            'btn',
            { 'two-btn': props.buttonList.length === 2 },
            { 'auto-height': props.isBtnAutoHeight }
          ]"
          v-for="(item, index) in props.buttonList"
          :key="index"
          @click="clickBtn(item)"
          :style="getStyle(item)">
          <img v-if="props.isBtnAutoHeight && item.backgroundImage" :src="item.backgroundImage" />
          <span class="text">{{ item.text }}</span>
        </div>
      </div>
    </div>
  </div>

</template>

<script setup lang="ts">
import { ref } from 'vue'
import { px2rem } from '@/utils/tools'

interface btnItem {
  backgroundImage?: string,
  text?: string,
  textColor?: string,
  fontSize?: string | number
}
const current = ref(0)
const props = withDefaults(defineProps<{
  buttonList: btnItem[],
  topBanner: string | string[],
  isBtnAutoHeight?: boolean
}>(), {
  buttonList: () => [],
  topBanner: '',
  isBtnAutoHeight: false
})
const onChange = (index: number) => {
  current.value = index
}
const getStyle = (item: btnItem) => {
  const fontSize = `${item.fontSize || 36}px`
  if (props.isBtnAutoHeight) {
    return {
      color: item.textColor,
      fontSize: `${px2rem(fontSize)}`
    }
  }
  return {
    background: `url(${item.backgroundImage})`,
    color: item.textColor,
    backgroundSize: '100% 100%'
  }
}
const emits = defineEmits(['clickBtn', 'close'])
const clickBtn = (item: any) => {
  emits('clickBtn', item)
}
const close = () => {
  emits('close')
}
</script>

<style lang="scss" scoped>
.dialog-content {
  display: flex;
  flex-direction: column;

  .close {
    align-self: flex-end;
    width: 58px;
    margin-bottom: 20px;
    margin-right: 20px;
  }

  .content {
    background: #ffffff;
    border-radius: 32px 32px 0 0;

    .custom-indicator {
      position: absolute;
      right: 46px;
      bottom: 30px;
      padding: 0 13px;
      border-radius: 30px;
      line-height: 29px;
      font-size: 20px;
      color: #FFFFFF;
      background: rgba(0, 0, 0, 0.4);
    }

    &-img {
      width: 100%;
    }

    &-btn {
      padding: 0 36px 30px;
      display: flex;
      flex-direction: row;
      align-items: center;

      .btn {
        font-size: 36px;
        font-weight: bold;
        width: 100%;
        height: 80px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        &.auto-height {
          position: relative;
          height: auto;

          img {
            width: 100%;
            height: auto;
          }

          .text {
            position: absolute;
          }
        }

        &.two-btn:nth-child(1) {
          width: 250px;
          margin-right: 18px;
        }

        &.two-btn:nth-child(2) {
          width: 410px;
        }
      }
    }
  }
}
</style>
