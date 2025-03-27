import { render, h } from 'vue'
import VueTemplate from './APITemplate.vue'
export default (option: any, confirmFun?: Function, cancelFun?: Function) => {
  option.teleport = document.getElementById('vant-confirm-dialog-primary-box')
  option.className = 'vant-confirm-dialog-primary'
  if (!option.teleport) {
    render(h(VueTemplate), document.body)
    option.teleport = document.getElementById('vant-confirm-dialog-primary-box')
  }
  showConfirmDialog(option)
    .then(() => {
      confirmFun && confirmFun()
    })
    .catch(() => {
      cancelFun && cancelFun()
    })
}