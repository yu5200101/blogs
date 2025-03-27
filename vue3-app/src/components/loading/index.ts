// 隐藏loading
export const hideLoading = () => {
  window.loadingInstance && window.loadingInstance.close()
}

// 显示loading
export const showLoading = (message: string = '加载中...') => {
  hideLoading()

  window.loadingInstance = showLoadingToast({
    duration: 0,
    forbidClick: true,
    loadingType: 'spinner',
    message
  })
}
