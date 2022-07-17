/**
 * @param {string} s
 * @return {boolean}
 */
 var isValid = function(s) {
  const ary = []
  for (let i = 0; i < s.length; i++) {
      if (['[', '{', '('].includes(s[i])) {
          ary.push(s[i])
      } else {
          if (!ary.length) return false
          const cur = ary.pop()
          if (cur !== '[' && s[i] === ']') {
              return false
          }
          if (cur !== '(' && s[i] === ')') {
              return false
          }
          if (cur !== '{' && s[i] === '}') {
              return false
          }
      }
  }
  return !ary.length
};