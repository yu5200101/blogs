<template>
  <wx-open-launch-weapp
    v-if="isWxH5()"
    :id="'launch-btn' + indexId"
    class="launch-btn"
    :appid="props.miniData.appId"
    :path="props.miniData.path"
    @error="handleError"
    @ready="handleReady"
    @launch="handleLaunch"
  >
    <component :is="'script'" type="text/wxtag-template">
      <component :is="'style'">
        .open{
          width: 100%;
          height: 1000px;
          border:none;
          outline:none;
          background: none;
          color: transparent;
        }
      </component>
      <button class="open">打开小程序</button>
    </component>
  </wx-open-launch-weapp>
</template>

<script lang="ts" setup>
import lodash from '@/utils/lodash'
import { isWxH5 } from '@/utils/platform'

const indexId = lodash.uniqueId()

interface MiniData {
  appId?: string
  path?: string
}

const props = withDefaults(defineProps<{
  miniData: MiniData,
  clickTrackOptions?: TrackOptions
}>(), {
  miniData: () => ({}),
  clickTrackOptions: () => ({
    elementCode: 0,
    extInfo: {}
  })
})

const emits = defineEmits(['weappready', 'weappconfirm'])

const handleError = () => emits('weappready', false)

const handleLaunch = async() => {
  emits('weappconfirm')
}

const handleReady = () => emits('weappready', true)

</script>

<style lang="scss" scoped>
.launch-btn {
  position: absolute;
  left: 0;
  top: 0;
  display: block;
  width: 100%;
  height: 100%;
  overflow-y: hidden;
}
</style>
