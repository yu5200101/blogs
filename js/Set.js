const set = new Set(['red', 'green', 'black'])
console.log(set.size);
console.log(set.add('yellow').add('blue'))
console.log(set.has('blue'))
console.log(set.delete('blue'))
console.log(set.has('blue'))
for (let key of set.keys()) {
  console.log('key', key)
}
for (let value of set.values()) {
  console.log('value', value)
}
for (let [key, value] of set.entries()) {
  console.log('key: %s, value: %s', key, value)
}
// 输出的是value
for (let item of set) {
  console.log(item)
}
set.forEach((value, key) => {
  console.log('key: %s, value: %s', key, value)
})
console.log(set.clear())

