// 复制公用函数
function copyValue (val) {
  // 如果这里换为 input 则不支持换行
  const temp = document.createElement('textarea')
  temp.value = val
  document.body.appendChild(temp)
  temp.select() // 选择对象
  document.execCommand('Copy') // 执行浏览器复制命令
  temp.style.display = 'none'
  document.body.removeChild(temp)
  console.log('copy success')
}

function showCustomMenu() {
  // 监听点击鼠标右键
  document.addEventListener('contextmenu', (event) => {
    event.preventDefault()
    const selection = window.getSelection()
    copyValue(selection.toString())
  })
}

showCustomMenu()
