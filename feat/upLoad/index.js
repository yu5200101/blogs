function upLoad() {
  const clientHeight = document.documentElement.clientHeight
  const scrollTop = document.documentElement.scrollTop
  const scrollHeight = document.body.scrollHeight

  // 安全距离
  const distance = 50
  if (scrollTop + clientHeight > scrollHeight - distance) {
    console.log('上拉加载更多')
  }
}

window.onscroll = debounce(upLoad, 200)