/**
 * @param {string} s
 * @return {number}
 */
var firstUniqChar = function (s) {
  let map = new Map()
  for (let [index, value] of Array.from(s).entries()) {
    if (!map.has(value)) {
      map.set(value, index)
    } else {
      map.set(value, -1)
    }
  }
  let n = s.length
  for (let value of map.values()) {
    if (value !== -1 && value < n) {
      n = value
    }
  }
  if (n === s.length) {
    return -1
  }
  return n
};