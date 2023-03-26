// 快速diff算法
const { effect, ref } = VueReactivity

const count = ref(1)
const bol = ref(false)

effect(() => {
  const vnode = {
    type: 'div',
    props: bol.value ? {
      onClick: () => {
        alert('父元素clicked')
      }
    } : {},
    children: [{
      type: 'p',
      props: {
        onClick: () => {
          bol.value = true
        }
      },
      children: 'text'
    }]
  }
  renderer.render(vnode, document.querySelector('#app'))
})

function renderer(domString, container) {
  container.innerHTML = domString
}
count.value++

const vnode = {
  type: 'h1',
  children: 'hello'
}

function shouldSetAsProps(el, key, value) {
  if (key === 'form' && el.tagName === 'INPUT') return false
  return key in el
}
function unmount(vnode) {
  if (vnode.type === Fragment) {
    vnode.children.forEach(c => unmount(c))
    return
  }
  const parent = vnode.el.parentNode
  if (parent) {
    parent.removeChild(vnode.el)
  }
}

function patchElement(n1, n2) {
  const el = n2.el = n1.el
  const oldProps = n1.props
  const newProps = n2.props
  for (const key in newProps) {
    if (newProps[key] !== oldProps[key]) {
      patchProps(el, key, oldProps[key], newProps[key])
    }
  }
  for (const key in oldProps) {
    if (!(key in newProps)) {
      patchProps(el, key, oldProps[key], null)
    }
  }
  // 更新children
  patchChildren(n1, n2, el)
}

function patchChildren(n1, n2, container) {
  // 判断新子节点的类型是否是文本节点
  if (typeof n2.children === 'string') {
    // 旧子节点的类型有三种可能，没有子节点，文本子节点以及一组子节点
    // 只有当旧子节点为一组子节点时，才需要逐个卸载，其他情况下什么都不需要做
    if (Array.isArray(n1.children)) {
      n1.children.forEach(e => unmount(e))
    }
    // 最后将新的文本节点内容设置给容器元素
    setElementText(container, n2.children)
  } else if (Array.isArray(n2.children)) {
    // 说明新子节点是一组子节点
    // 判断旧子节点是否也是一组子节点
    // if (Array.isArray(n1.children)) {
    //   // 代码运行到这里，则说明新旧子节点都是一组子节点，这里涉及核心的diff算法
    //   const newLen = newChildren.length
    //   const oldLen = oldChildren.length
    //   const commonLength = Math.mix(newLen, oldLen)
    //   for (let i = 0; i < commonLength; i++) {
    //     patch(oldChildren[i], newChildren[i], container)
    //   }
    //   if (newLen > oldLen) {
    //     for (let i = commonLength; i < newLen; i++) {
    //       patch(null, newChildren[i], container)
    //     }
    //   } else {
    //     for (let i = commonLength; i < oldLen; i++) {
    //       unmount(oldChildren[i])
    //     }
    //   }
    // } else {
    //   // 此时
    //   // 旧子节点要么是文本子节点，要么不存在
    //   // 但无论哪种情况，我们都只需要将容器清空，然后将新的一组子节点逐个挂载
    //   setElementText(container, '')
    //   n2.children.forEach(c => patch(null, c, container))
    // }
    const oldChildren = n1.children
    const newChildren = n2.children
    // 用来存储寻找过程中遇到的最大索引值
    let lastIndex = 0
    // 遍历新的children
    for (let i = 0; i < newChildren.length; i++) {
      const newVNode = newChildren[i]
      // 在第一层循环中定义变量find,代表是否在旧的一组子节点中找到可复用的节点
      // 初始值为false，代表没找到
      let j = 0
      let find = false
      // 遍历旧的children
      for (j; j < oldChildren.length; j++) {
        const oldVNode = oldChildren[j]
        // 如果找到了具有相同key值的两个节点，说明可以复用，但仍然需要调用patch函数更新
        if (newVNode.key === oldVNode.key) {
          find = true
          patch(oldVNode, newVNode, container)
          if (j < lastIndex) {
            // 如果当前找到的节点在旧children中的索引小于最大索引值lastIndex
            // 说明该节点对应的真实DOM需要移动
            // 获取newVNode的前一个vnode 即prevVNode
            const prevVNode = newChildren[i - 1]
            // 如果prevVNode不存在，则说明当前newVNode是第一个节点，它不需要移动
            if(prevVNode) {
              // 由于我们要将newVNode对应的真实DOM移动到prevVNode所对应真实DOM后面，
              // 所以我们需要获取prevVNode所对应真实DOM的下一个兄弟节点，并将其作为锚点
              const anchor = prevVNode.el.nextSibling
              // 调用insert方法将newVNode 对应的真实DOM插入到锚点元素前面
              // 也就是prevVNode对应真实DOM的后面
              insert(newVNode.el, container, anchor)
            }
          } else {
            // 更新lastIndex
            lastIndex = j
          }
          // 这里需要break
          break
        }
      }
      // 如果代码运行到这里，find仍然未false
      // 说明当前newVNode没有在旧的一组子节点中找到可复用的节点
      // 也就是说，当前newVNode是新增节点，需要挂载
      if (!find) {
        // 为了将节点挂载到正确为止，我们需要先获取锚点元素
        // 首先获取当前newVNode的前一个vnode节点
        const prevVNode = newChildren[i - 1]
        if (prevVNode) {
          // 如果有前一个vnode节点，则使用它的下一个兄弟节点作为锚点元素
          anchor = prevVNode.el.nextSibling
        } else {
          // 如果没有前一个vnode节点，说明即将挂载的新节点是第一个子节点
          // 这时我们使用容器元素的firstChild作为锚点
          anchor = container.firstChild
        }
        // 挂载newVNode
        patch(null, newVNode, container, anchor)
      }
    }
    // 上一步的更新操作完成后
    // 遍历旧的一组子节点
    for (let i = 0; i < oldChildren.length; i++) {
      const oldVNode = oldChildren[i]
      // 拿旧子节点oldVNode去新的一组子节点中寻找具有相同key值的节点
      const has = newChildren.find(vnode => vnode.key === oldVNode.key)
      if (!has) {
        // 如果没有找到具有相同key值的节点，则说明需要删除该节点
        // 调用unmount函数将其卸载
        unmount(oldVNode)
      }
    }
  } else {
    // 代码运行到这里，说明新子节点不存在
    // 旧子节点是一组子节点，只需要逐个卸载即可
    if (Array.isArray(n1.children)) {
      n1.children.forEach(c => unmount(c))
    } else if (typeof n1.children === 'string') {
      // 旧节点是文本子节点，清空内容即可
      setElementText(container, '')
    }
    // 如果也没有旧子节点，那么什么都不需要做
  }
}

function patchKeyedChildren(n1, n2, container) {
  const oldChildren = n1.children
  const newChildren = n2.children
  // 四个索引值
  let oldStartIndex = 0
  let oldEndIndex = oldChildren.length - 1
  let newStartIndex = 0
  let newEndIndex = newChildren.length - 1
  // 四个索引指向的vnode节点
  let oldStartVNode = oldChildren[oldStartIndex]
  let oldEndVNode = oldChildren[oldEndIndex]
  let newStartVNode = newChildren[newStartIndex]
  let newEndVNode = newChildren[newEndIndex]

  while(oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
    // 增加两个判断分支，如果头尾部节点为undefined，则说明该节点已经被处理过了，直接跳到下一个位置
    if (!oldStartVNode) {
      oldStartVNode = oldChildren[++oldStartIndex]
    } else if (!oldEndVNode) {
      oldEndVNode = oldChildren[--oldEndIndex]
    } else if (oldStartVNode.key === newStartVNode.key) {
      // step1:oldStartVNode和newStartVNode
      patch(oldStartVNode, newStartVNode, container)
      oldStartVNode = oldChildren[++oldStartIndex]
      newStartVNode = newChildren[++newStartIndex]
      old
    } else if (oldEndVNode.key === newEndVNode.key) {
      // step2:oldEndVNode和newEndVNode
      // 节点在新的顺序中仍然处于尾部，不需要移动，但仍需打补丁
      patch(oldEndVNode, newEndVNode, container)
      // 更新索引和头尾部节点变量
      oldEndVNode = oldChildren[--oldEndIndex]
      newEndVNode = newChildren[--newEndIndex]
    } else if (oldStartVNode.key === newEndVNode.key) {
      // step3:oldStartVNode和newEndVNode
      // 需打补丁
      patch(oldStartVNode, newEndVNode, container)
      insert(oldStartVNode.el, container, oldEndVNode.el.nextSibling)
      oldStartVNode = oldChildren[++oldStartIndex]
      newEndVNode = newChildren[--newEndIndex]
    } else if (oldEndVNode.key === newStartVNode.key) {
      // step4:oldEndVNode和newStartVNode
      // 仍然需要调用patch函数进行打补丁
      patch(oldEndVNode, newStartVNode, container)
      // 移动dom操作
      // oldEndVNode.el移动到oldStartVNode.el前面
      insert(oldEndVNode.el, container, oldStartVNode.el)
      // 移动dom完成后，更新索引值，并指向下一个位置
      oldEndVNode = oldChildren[--oldEndIndex]
      newStartVNode = newChildren[++newStartIndex]
    } else {
      // 遍历旧的一组子节点，试图寻找与newStartVNode拥有相同key值的节点
      // idxInOld就是新的一组子节点的头部节点在旧的一组子节点中的索引
      const idxInOld = oldChildren.findIndex(node => node.key === newStartVNode.key)
      // idxInOld大于0，说明找到了可复用的节点，并且需要将其对应的真实DOM移动到头部
      if (idxInOld > 0) {
        // idxInOld位置对应的vnode就是需要移动的节点
        const vnodeToMove = oldChildren[idxInOld]
        // 打补丁
        patch(vnodeToMove, newStartVNode, container)
        // 将vnodeToMove.el移动到头部节点oldStartVNode.el之前，因此使用后者作为锚点
        insert(vnodeToMove.el, container, oldStartVNode.el)
        // 由于位置idxInOld处的节点所对应的真实DOM已经移动到了别处，因此将其设置为undefined
        oldChildren[idxInOld] = undefined
      } else {
        // 将newStartVNode作为新节点挂载到头部，使用当前头部节点oldStartVNode.el作为锚点
        patch(null, newStartVNode, container, oldStartVNode.el)
      }
      // 最后更新newStartIndex到下一位置
      newStartVNode = newChildren[++newStartIndex]
    }
  }

  // 循环结束后检查索引值的情况
  if (oldEndIndex < oldStartIndex && newStartIndex <= newEndIndex) {
    // 如果满足条件，则说明有新的节点遗留，需要挂载他们
    for (let i = newStartIndex; i < newEndIndex; i++) {
      patch(null, newChildren[i], container, oldStartVNode.el)
    }
  } else if (oldStartIndex <= oldEndIndex && newStartIndex > newEndIndex) {
    for (let i = oldStartIndex; i < oldIndexIndex; i++) {
      unmount(oldChildren[i])
    }
  }
}

function patchFastKeyedChildren(n1, n2, container) {
  const newChildren = n2.children
  const oldChildren = n1.children
  // 处理相同的前置节点
  // 索引j指向新旧两组子节点的开头
  let j = 0
  let oldVNode = oldChildren[j]
  let newVNode = newChildren[j]
  // while循环向后遍历，直到遇到拥有不同key值的节点为止
  while (oldVNode.key === newVNode.key) {
    patch(oldVNode, newVNode, container)
    // 更新索引j，让其递增
    j++
    oldVNode = oldChildren[j]
    newVNode = newChildren[j]
  }

  // 更新相同的后置节点
  // 索引oldEnd指向旧的一组子节点的最后一个节点
  let oldEnd = oldChildren.length - 1
  // 索引newEnd指向新的一组子节点的最后一个节点
  let newEnd = newChildren.length - 1

  oldVNode = oldChildren[oldEnd]
  newVNode = newChildren[newEnd]
  while(oldVNode.key === newVNode.key) {
    patch(oldVNode, newVNode, container)
    oldEnd--
    newEnd--
    oldVNode = oldChildren[oldEnd]
    newVNode = newChildren[newEnd]
  }
  // 预处理完毕后，如果满足如下条件，则说明从j => newEnd之间的节点应作为新节点插入
  if (j > oldEnd && j <= newEnd) {
    // 锚点的索引
    const anchorIndex = newEnd + 1
    // 锚点元素
    const anchor = anchorIndex < newChildren.length ? newChildren[anchorIndex].el : null
    // 采用while循环，调用patch函数逐个挂载新赠节点
    while(j <= newEnd) {
      patch(null, newChildren[j++], container, anchor)
    }
  }
}

const Text = Symbol()
const newVNode1 = {
  // 描述文本节点
  type: Text,
  children: '我是文本内容'
}

const Comment = Symbol()
const newVNode2 = {
  type: Comment,
  children: '我是注释内容'
}

const Fragment = Symbol()
const newVNode3 = {
  type: Fragment,
  children: [
    { type: 'li', children: 'text1' },
    { type: 'li', children: 'text2' },
    { type: 'li', children: 'text3' }
  ]
}

function createRenderer(options) {
  const {
    createElement,
    insert,
    setElementText,
    createText,
    setText,
    createComment
  } = options
  // 在这个作用域内定义的函数都可以访问那些API
  function mountElement(vnode, container, anchor) {
    const el = vnode.el = createElement(vnode.type)
    if (typeof vnode.children === 'string') {
      setElementText(el, vnode.children)
    }
    // container.appendChild(el)
    else if (Array.isArray(vnode.children)) {
      // 如果是数组，说明是多个子节点
      vnode.children.forEach(child => {
        patch(null, child, el)
      })
    }
    if (vnode.props) {
      // 遍历vnode.props
      for (const key in vnode.props) {
        // 用in操作符判断key是否存在对应的DOM Properties
        // 调用setAttribute将属性设置到元素上
        // el.setAttribute(key, vnode.props[key])
        patchProps(el, key, null, vnode.props[key])
      }
    }
    insert(el, container, anchor)
  }
  function patch(n1, n2, container, anchor) {
    // 如果n1存在，则对比n1和n2的类型
    if (n1 && n1.type !== n2.type) {
      // 如果新旧vnode的类型不同，则直接将旧vnode卸
      unmount(n1)
      n1 = null
    }
    const { type } = n2
    if (typeof type === 'string') {
      if (!n1) {
        // 挂载时将锚点元素作为第三个参数传递给mountElement函数
        mountElement(n2, container, anchor)
      } else {
        patchElement(n1, n2)
      }
    } else if (typeof type === 'object') {
      // 如果n2.type的值的类型是对象，则它描述的是组件
    } else if (type === Text) {
      // 处理其他类型的vnode
      if (!n1) {
        // const el = n2.el = document.createTextNode(n2.children)
        const el = n2.el = createText(n2.children)
        insert(el, container)
      } else {
        // 如果旧vnode存在，只需要使用新文本节点的文本内容更新旧文本节点即可
        const el = n2.el = n1.el
        if (n2.children !== n1.children) {
          // el.nodeValue = n2.children
          setText(el, n2.children)
        }
      }
    } else if (type === Comment) {
      // 处理其他类型的vnode
      if (!n1) {
        // const el = n2.el = document.createComment(n2.children)
        const el = n2.el = createComment(n2.children)
        insert(el, container)
      } else {
        // 如果旧vnode存在，只需要使用新文本节点的文本内容更新旧文本节点即可
        const el = n2.el = n1.el
        if (n2.children !== n1.children) {
          // el.nodeValue = n2.children
          setText(el, n2.children)
        }
      }
    } else if (type === Fragment) {
      // 处理Fragment类型的vnode
      // 如果旧vnode不存在，则只需要将Fragment 的children逐个挂载即可
      if (!n1) {
        n2.children.forEach(c => patch(null, c, container))
      } else {
        // 如果旧vnode存在，则只需要更新Fragment的children即可
        patchChildren(n1, n2, container)
      }
    }
  }
  function render(vnode, container) {
    if (vnode) {
      // 新vnode存在，将其与旧VNODE一起传递给patch函数，进行打补丁
      patch(container._vnode, vnode, container)
    } else {
      if (container._vnode) {
        unmount(container._vnode)
        // // 旧vnode存在，且新vnode不存在，说明是卸载操作
        // container.innerHTML = ''
      }
    }
    // 把vnode存储到container._vnode下，即后续渲染中的旧vnode
    container._vnode = vnode
  }
  function hydrate(vnode, container) { }
  return {
    render,
    hydrate
  }
}


const renderer = createRenderer({
  createElement(tag) {
    return document.createElement(tag)
  },
  setElementText(el, text) {
    el.textContent = text
  },
  insert(el, parent, anchor = null) {
    parent.insertBefore(el, anchor)
  },
  // 将属性设置相关操作封装到patchProps函数中，并作为渲染器选项传递
  patchProps(el, key, prevValue, nextValue) {
    // 匹配以on开头的属性，视其为事件
    if (/^on/.test(key)) {
      // 获取为该元素伪造的事件处理函数invoker
      const invokers = el._vei || (el._vei = {})
      let invoker = invokers[key]
      // 根据属性名称得到对应的事件名称，例如onClick => click
      const name = key.slice(2).toLowerCase()
      if (nextValue) {
        if (!invoker) {
          // 如果没有invoker 则将一个伪造的invoker缓存到el._vei中
          // invoker = el.vei[key] = (e) => {
          //   // 当伪造的事件处理函数执行时，会执行真正的事件处理函数
          //   invoker.value(e)
          // }
          invoker = el._vei[key] = (e) => {
            // e.timeStamp是事件发生的时间
            // 如果事件发生的时间早于事件处理函数绑定的时间，则不执行事件处理函数
            if (e.timeStamp < invoker.attached) return
            if (Array.isArray(invoker.value)) {
              invoker.value.forEach(fn => fn(e))
            } else {
              invoker.value(e)
            }
          }
          // 添加invoker.attached属性，存储事件处理函数被绑定的时间
          invoker.attached = performance.now()
          invoker.value = nextValue
          el.addEventListener(name, invoker)
        } else {
          // 如果invoker存在，意味着更新，并且只需要更新invoker.value的值即可
          invoker.value = nextValue
        }
      } else if (invoker) {
        // 新的事件绑定函数不存在，且之前绑定的invoker存在，则移除绑定
        el.removeEventListener(name, invoker)
      }
      // 移除上一次绑定的事件处理函数
      prevValue && el.removeEventListener(name, prevValue)
      // 绑定事件，nextValue为事件处理函数
      el.addEventListener(name, nextValue)
    }
    else if (key === 'class') {
      el.className = nextValue || ''
    } else if (shouldSetAsProps(el, key, nextValue)) {
      // 获取该DOM Properties的类型
      const type = typeof el[key]
      if (type === 'boolean' && nextValue === '') {
        el[key] = true
      } else {
        el[key] = nextValue
      }
    } else {
      // 如果要设置的属性没有对应的DOM Properties 则使用setAttribute函数设置属性
      el.setAttribute(key, nextValue)
    }
  },
  createText(text) {
    return document.createTextNode(text)
  },
  createText(text) {
    return document.createComment(text)
  },
  setText(el, text) {
    el.nodeValue = text
  }
})

// const renderer = createRenderer({
//   createElement(tag) {
//     console.log(`创建元素${tag}`);
//     return {tag}
//   },
//   setElementText(el, text) {
//     el.textContent = text
//   },
//   insert(el, parent, anchor = null) {
//     parent.children = el
//   }
// })

renderer.render(vnode, document.querySelector('#app'))

const newNode3 = {
  type: 'ul',
  children: [{
    type: Fragment,
    children: [
      { type: 'li', children: 'text1' },
      { type: 'li', children: 'text2' },
      { type: 'li', children: 'text3' }
    ]
  }]
}

const oldVNode = {
  type: 'div',
  children: [
    { type: 'p', children: '1' },
    { type: 'p', children: '2' },
    { type: 'p', children: '3' }
  ]
}

const newVNode = {
  type: 'div',
  children: [
    { type: 'p', children: '4' },
    { type: 'p', children: '5' },
    { type: 'p', children: '6' }
  ]
}
