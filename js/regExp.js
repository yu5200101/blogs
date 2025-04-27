const reg = /t(e)(st(\d?))/g
const result = [...'test1test2'.matchAll(reg)]
// [
// ['test1', 'e', 'st1', '1', index: 0, input: 'test1test2', groups: undefined]
// ['test2', 'e', 'st2', '2', index: 5, input: 'test1test2', groups: undefined]
// ]
console.log(result)

const reg1 = /javascript/
const regWithG = /javascript/g

const str = 'hello javascript, is cool javascript'

// 返回匹配项包含分组和内容 ['javascript', index: 6, input: 'hello javascript, is cool javascript', groups: undefined]
console.log(str.match(reg1))
// 返回匹配到的字符数组  ['javascript', 'javascript']
console.log(str.match(regWithG))

// 返回匹配项包含分组和内容 ['javascript', index: 6, input: 'hello javascript, is cool javascript', groups: undefined]
console.log(reg1.exec(str))
// 返回匹配项包含分组和内容 ['javascript', index: 6, input: 'hello javascript, is cool javascript', groups: undefined]
console.log(regWithG.exec(str))

// 判断 DOM 标签的合法性，标签的闭合，span 里面不能有 div，写一个匹配 DOM 标签的正则
function validateDom(html) {
  const reg = /<(\/?)([a-zA-Z][a-zA-Z0-9]*)\s*([^>]*?)(\/?)>/g
  const stack = []
  let match
  while((match = reg.exec(html)) !== null) {
    const isClose = match[1] === '/'
    const tagName = match[2].toLowerCase()
    const isSelfClose = match[4] === '/'
    if (isClose) {
      if (stack.length === 0 || stack.pop() !== tagName) {
        return false
      }
    } else if (isSelfClose) {
      const parent = stack[stack.length - 1]
      if (parent === 'span' && tagName === 'div') {
        return false
      }
    } else {
      const parent = stack[stack.length - 1]
      if (parent === 'span' && tagName === 'div') {
        return false
      }
      stack.push(tagName)
    }
  }
  return stack.length === 0
}

const html = '<div class="example" data-info="test"><span class="test" data-info="yes">hhhhh</span><img src="data.img" /></div>'
const html2 = '<span class="example" data-info="test"><div class="test" data-info="yes">hhhhh</div><img src="data.img" /></span>'
console.log('validateDom', validateDom(html))
console.log('validateDom', validateDom(html2))