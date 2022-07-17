/**
 * @param {string} s
 * @return {number}
 */
 var lengthOfLongestSubstring = function(s) {
  let n = s.length
  if (n <= 1) return n
  let left = 0
  let right = 0
  let max = 0
  const str = new Set()
  while(right < n) {
      if (!str.has(s[right])) {
          str.add(s[right])
          max = Math.max(max, right - left + 1)
          right++
      } else {
          str.delete(s[left])
          left++
      }
  }
  return max
};

/**
 * @param {string} s
 * @return {number}
 */
 var lengthOfLongestSubstring = function(s) {
  let n = s.length
  if (n <= 1) return n
  let left = 0
  let right = 0
  let max = 0
  const str = new Map()
  while(right < n) {
      const rightIndex = str.has(s[right]) ? str.get(s[right]) : -1
      left = Math.max(left, rightIndex)
      max = Math.max(max, right - left + 1)
      str.set(s[right], right + 1)
      right++
  }
  return max
};


/**
 * @param {string} s
 * @return {number}
 */
 var lengthOfLongestSubstring = function(s) {
  let n = s.length
  if (n <= 1) return n
  let left = 0
  let right = 0
  let max = 0
  const ary = new Array(128)
  while(right < n) {
      const rightChar = s[right].charCodeAt()
      const rightIndex = ary[rightChar] || 0
      left = Math.max(left, rightIndex)
      max = Math.max(max, right - left + 1)
      ary[rightChar] = right + 1
      right++
  }
  return max
};