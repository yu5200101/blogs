class Node {
  constructor(data, next = null) {
    this.data = data
    this.next = next
  }
}
class singleLink {
  constructor() {
    this.size = 0
    this.head = new Node(null, null)
  }

  getLength() {
    return this.size
  }

  isEmpty() {
    this.size === 0
  }

  displayList() {
    let list = ''
    let currentNode = this.head.next
    while (currentNode) {
      // 若当前节点不为空，则表明当前节点中存在数据
      list += currentNode.data
      // 同时让当前节点的指针指向下一节点
      currentNode = currentNode.next
      if (currentNode) {
        list += '->'
      }
    }
    console.log(list)
  }

  findLast() {
    let currentNode = this.head
    while (currentNode.next) {
      currentNode = currentNode.next
    }
    return currentNode
  }

  appendNode(element) {
    let currentNode = this.findLast()
    let newNode = new Node(element)
    currentNode.next = newNode
    newNode.next = null
    this.size++
  }

  deleteList(element) {
    let leftNode = null
    let currentNode = this.head
    while (currentNode.data !== element) {
      leftNode = currentNode
      currentNode = currentNode.next
    }
    leftNode.next = currentNode.next
    this.size--
  }
  addFirstNode(element) {
    // let newNode = new Node(element)
    // newNode.next = this.head.next
    // this.head.next = newNode

    // this.head.next = new Node(element, this.head.next)

    // this.size++

    this.add(0, element)
  }
  addNode(curElement, element) {
    // let newNode = new Node(element)
    let currentNode = this.head
    while (currentNode.data !== curElement) {
      currentNode = currentNode.next
    }
    // newNode.next = currentNode.next
    // currentNode.next = newNode
    currentNode.next = new Node(element, currentNode.next)
    this.size++
  }
  add(index, element) {
    if (index < 0 || index > this.size) {
      throw Error('not')
    }
    let prev = this.head
    for (let i = 0; i < index; i++) {
      prev = prev.next
    }
    // let newNode = new Node(element)
    // newNode.next = prev.next
    // prev.next = newNode
    prev.next = new Node(element, prev.next)
    this.size++
  }
  addLastNode(element) {
    this.add(this.size, element)
  }
  get(index) {
    if (index < 0 || index >= this.size) {
      throw Error('not')
    }
    let prev = this.head.next
    for (let i = 0; i < index; i++) {
      prev = prev.next
    }
    console.log(prev.data)
  }
  getFirst() {
    this.get(0)
  }
  getLast() {
    this.get(this.size - 1)
  }
  set(index, element) {
    if (index < 0 || index >= this.size) {
      throw Error('not')
    }
    let prev = this.head.next
    for(let i = 0; i < index; i++) {
      prev = prev.next
    }
    prev.data = element
  }
  find(element) {
    let prev = this.head.next
    for(let i = 0; i < this.size; i++) {
      if (prev.data === element) {
        return true
      }
      prev = prev.next
    }
    return false
  }
  delete(index) {
    if (index < 0 || index >= this.size) {
      throw Error('not')
    }
    let prev = this.head
    for (let i = 0; i < index; i++) {
      prev = prev.next
    }
    let deleteEle = prev.next
    prev.next = deleteEle.next
    deleteEle.next = null
    this.size--
  }
  deleteFirst() {
    this.delete(0)
  }
  deleteLast() {
    this.delete(this.size - 1)
  }
}

// 上述链表代码的测试
// 最好使用循环，往里面加数据
var sList = new singleLink()

var arr = [1001, 1234, 1006, 7788, 5512, 6129]
for (var i = 0; i < arr.length; i++) {
  sList.appendNode(arr[i])
}
sList.displayList()
// sList.deleteList(1001)
// sList.addFirstNode(1002)
// sList.addNode(1234, 2345)
// sList.add(1, 3456)
// sList.addLastNode(3333)
// sList.get(1)
// sList.getFirst()
// sList.getLast()
// sList.set(1, 2222)
// sList.delete(2)
// sList.deleteFirst()
// sList.deleteLast()
sList.displayList()
// console.log(sList.find(1111))


