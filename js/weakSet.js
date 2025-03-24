function* helloWorldGenerator() {
  yield { 'helloKey': 'hello' }
  yield { 'worldKey': 'worldKey' }
  return { 'endKey': 'end' }
}

const hw = helloWorldGenerator()

// WeakSet只能接受引用数据类型，可以接受iterator对象
// 没有size，无法遍历
const ws = new WeakSet(hw)
console.log(ws.size);
const yellow = { 'yellowKey': 'yellow' }
console.log(ws.add(yellow).add({ 'blueKey': 'blue' }))
console.log(ws.has(yellow))
console.log(ws.delete(yellow))
console.log(ws.has(yellow))
console.log(ws)
