<template>
  <van-dialog
    :show="options.show"
    :title="options.title"
    :confirm-button-text="options.confirmButtonText"
    :closeOnClickOverlay="options.closeOnClickOverlay"
    :show-cancel-button="options.showCancelButton"
    class="vant-confirm-dialog-primary"
    :before-close="options.beforeClose "
    @confirm="emits('confirm')"
    @cancel="emits('cancel')"
    @close="closeFn">
      <slot/>
  </van-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const DefaultOptions = {
  show: false,
  closeable: false,
  closeOnClickOverlay: false,
  showConfirmButton: true,
  showCancelButton: false
}

const emits = defineEmits(['update:show', 'close', 'confirm', 'cancel'])

const closeFn = () => {
  emits('close')
  emits('update:show', false)
}

const props = defineProps({
  options: {
    type: Object,
    default: () => ({})
  }
})
const options = computed(() => {
  return Object.assign(DefaultOptions, props.options)
})
</script>
