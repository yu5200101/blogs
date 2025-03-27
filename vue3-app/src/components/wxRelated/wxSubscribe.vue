<!--
 * @Description: 订阅按钮，点击订阅触发订阅弹窗
-->
<template>
  <wx-open-subscribe
    :template="props.templateIdList"
    @success="wxSubscribeSuccess"
    @error="wxSubscribeErr"
    style="position:absolute;top:0;left:0;width:100%;height:100%;overflow:hidden; outline: 0;opacity: 0; ">
    <!-- 用来撑开订阅按钮 -->
    <component :is="'script'" type="text/wxtag-template">
      <div style="width: 1000px;height:1000px;"/>
    </component>
  </wx-open-subscribe>
</template>

<script lang="ts" setup>
const emits = defineEmits(['wxSubscribeSuccess', 'wxSubscribeErr'])
const wxSubscribeSuccess = (res: any) => {
  emits('wxSubscribeSuccess', res)
}
const wxSubscribeErr = (res: any) => {
  emits('wxSubscribeErr', res)
}

const props = defineProps({
  templateIdList: {
    type: String,
    required: true
  }
})
</script>
