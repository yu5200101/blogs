class Stack {
  constructor() {
    this.size = 0
    this.array = new Array()
  }
  getLength() {
    return this.size
  }

  isEmpty() {
    return this.size === 0
  }
  push(element) {
    this.array[this.size++] = element
  }
  pop() {
    if (!this.size) return
    this.size--
    return this.array[this.size]
  }
  peek() {
    if (!this.size) return
    return this.array[this.size - 1]
  }
  toString() {
    let res = 'Stack:['
    for (let i = 0; i < this.size; i ++) {
      res += this.array[i]
      if (i !== this.size - 1) {
        res += ','
      }
    }
    res += ']:top'
    return res
  }
}

// const stack = new Stack()
// stack.push(1)
// stack.push(2)
// console.log(stack.peek())
// console.log(stack.getLength())
// console.log(stack.toString())
function isValid(s) {
  const stack = new Stack()
  for (let i = 0; i < s.length; i++) {
    if (['(', '[', '{'].includes(s[i])) {
      stack.push(s[i])
    } else {
      if (stack.isEmpty()) {
        return false
      }
      const top = stack.pop()
      if (s[i] === ')' && top !== '(') {
        return false
      }
      if (s[i] === ']' && top !== '[') {
        return false
      }
      if (s[i] === '}' && top !== '{') {
        return false
      }
    }
  }
  return stack.isEmpty()
}
console.log(isValid('([])'))