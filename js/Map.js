const map = new Map([
  ['redKey', 'red'],
  ['greenKey', 'green'],
  ['blackKey', 'black']
])
console.log(map.size)
console.log(map.set('blueKey', 'blue').set('yellowKey', 'yellow'))
console.log(map.get('blueKey'))
console.log(map.has('blueKey'))
console.log(map.delete('blueKey'))
for (let key of map.keys()) {
  console.log('key', key)
}
for (let value of map.values()) {
  console.log('value', value)
}
for (let [key, value] of map.entries()) {
  console.log('key: %s, value: %s', key, value)
}
// 输出的是[key,value]
for (let item of map) {
  console.log(item)
}
map.forEach((value, key) => {
  console.log('key: %s, value: %s', key, value)
})
console.log(map.clear())
