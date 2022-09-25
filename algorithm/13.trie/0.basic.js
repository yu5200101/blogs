// 字典树 设置单词结尾
class Node {
  constructor(isWord = false, value = 0) {
    this.isWord = isWord
    this.value = value
    this.next = new Map()
  }
}
class Trie {
  constructor() {
    this.root = new Node()
    this.size = 0
  }
  getSize() {
    return this.size
  }
  add(word) {
    let cur = this.root
    for (let i = 0; i < word.length; i++) {
      let c = word[i]
      if (cur.next.get(c) === null) {
        cur.next.set(c, new Node())
      }
      cur = cur.next.get(c)
    }
    if (!cur.isWord) {
      cur.isWord = true
      this.size++
    }
  }
  contains(word) {
    let cur = this.root
    for (let i = 0; i < word.length; i++) {
      let c = word[i]
      if (cur.next.get(c) === null) {
        return false
      }
      cur = cur.next.get(c)
    }
    return cur.isWord
  }
  // 查询trie中是否有以prefix为前缀
  isPremix(prefix) {
    let cur = this.root
    for (let i = 0; i < prefix.length; i++) {
      let c = prefix[i]
      if (cur.next.get(c) === null) {
        return false
      }
      cur = cur.next.get(c)
    }
    return true
  }
  search(word) {
    return this.match(this.root, word, 0)
  }
  match(node, word, index) {
    if (index === word.length) {
      return node.isWord
    }
    let c = word[index]
    if (c !== '.') {
      if (node.next.get(c) === null) {
        return false
      }
      return this.match(node.next.get(c), word, index + 1)
    } else {
      for (let nextNode of node.next.keys()) {
        if (this.match(nextNode, word, index + 1)) {
          return true
        }
      }
      return false
    }
  }
  insert(key, val) {
    let cur = this.root
    for(let i = 0; i < key.length; i++) {
      let c = key[i]
      if (cur.next.get(c) === null) {
        cur.next.set(c, new Node)
      }
      cur = cur.next.get(c)
    }
    cur.value = val
  }
  sum(prefix) {
    let cur = this.root
    for (let i = 0; i < prefix; i++) {
      let c = prefix[i]
      if (cur.next.get(c) === null) return 0
      cur = cur.next.get(c)
    }
    return this.sumTotal(cur)
  }
  sumTotal(node) {
    if (node.next.size === 0) {
      return node.value
    }
    let res = node.value
    for (let k of node.next.keys()) {
      res += this.sumTotal(node.next.get(k))
    }
    return res
  }
}
