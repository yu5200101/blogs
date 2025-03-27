// 左右抖动toast
export const showShakeToast = (message: string) => {
  showToast({
    message,
    className: 'shake-toast'
  })
}