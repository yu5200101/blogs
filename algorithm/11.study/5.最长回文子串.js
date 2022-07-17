

/**
 * @param {string} s
 * @return {string}
 */
var longestPalindrome = function (s) {
  let oldLen = s.length
  let newLen = oldLen * 2 + 1
  let maxRight = 0
  let maxCenter = 0
  let resCenter = 0
  let resLen = 0
  let index = 0
  let newStr = []
  let p = new Array(newLen).fill(1)
  for (let i = 0; i < newLen; i++) {
    newStr[i] = i % 2 === 0 ? '#' : s[index++]
  }
  for (let i = 0; i < newLen; i++) {
    const j = maxCenter - (i - maxCenter)
    if (i < maxRight) {
      if (p[j] < maxRight - i) {
        p[i] = p[j]
      } else {
        p[i] = maxRight - i
        while (i - p[i] >= 0 && i + p[i] < newLen
          && newStr[i - p[i]] === newStr[i + p[i]]) {
          p[i]++
        }
      }
    } else {
      p[i] = 1
      while (i - p[i] >= 0 && i + p[i] < newLen
        && newStr[i - p[i]] === newStr[i + p[i]]) {
        p[i]++
      }
    }
    if (i + p[i] > maxRight) {
      maxRight = i + p[i]
      maxCenter = i
    }
    if (p[i] > resLen) {
      resLen = p[i]
      resCenter = maxCenter
    }
  }
  let start = resCenter - resLen + 1
  return newStr.join('').slice(start, start + resLen * 2 - 1).replace(/\#/g, '')
};

console.log(longestPalindrome('aacabdkacaa'))