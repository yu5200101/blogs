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