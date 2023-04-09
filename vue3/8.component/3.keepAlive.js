const MyComponent = {
  name: 'MyComponent',
  props: {
    title: String
  },
  data() {
    return {
      foo: 'hello world'
    }
  },
  render() {
    return {
      type: 'div',
      children: '文本'
    }
  },
  setup(props, setupContext) {
    // 访问传入的props数据
    // props.foo
    const { slots, emit, attrs, expose } = setupContext
    // setup函数可以返回一个函数，该函数将作为组件的渲染函数
    // return () => {
    //   return {type: 'div', children: 'hello'}
    // }
    // 发射change事件，并传递给事件处理函数两个参数
    emit('change', 1, 2)
    const count = ref(0)
    // 返回一个对象，对象中的数据会暴露到渲染函数中
    return {
      count
    }
  },
  render() {
    // 通过this可以访问setup暴露出来的响应式数据
    return {type: 'div', children: `count id : ${this.count}`}
  }
}

function shouldSetAsProps(el, key, value) {
  if (key === 'form' && el.tagName === 'INPUT') return false
  return key in el
}
function unmount(vnode) {
  if (vnode.type === Fragment) {
    vnode.children.forEach(c => unmount(c))
    return
  } else if (typeof vnode.type === 'object') {
    // vnode.shouldKeepAlive 是一个布尔值，用来标识该组件是否应该被KeepAlive
    if (vnode.shouldKeepAlive) {
      // 对于需要被KeepAlive的组件，我们不应该真的卸载它，而应该调用该组件的父组件
      // 即KeepAlive组件的_deActivate函数使其失活
      vnode.keepAliveInstance._deActivate(vnode)
    } else {
      // 对于组件的卸载，本质上是要写在组件所渲染的内容，即subTree
      unmount(vnode.component.subTree)
    }
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
  } else if (j <= oldEnd && j > newEnd) {
    // j -> oldEnd 之间的节点应该被卸载
    while(j <= oldEnd) {
      unmount(oldChildren[j++])
    }
  } else {
    // 构造source数组
    // 新的一组子节点中剩余未处理节点的数量
    const count = newEnd - j + 1
    const source = new Array(count)
    source.fill(-1)
    // oldStart和newStart分别为起始索引，即j
    const oldStart = j
    const newStart = j
    // 新增两个变量，moved和pos
    let moved = false
    let pos = 0
    // 两层循环复杂度O(n2)
    // for (let i = oldStart; i <= oldEnd; i++) {
    //   const oldVNode = oldChildren[i]
    //   for (let k = newStart; k <= newEnd; k++) {
    //     const newVNode = newChildren[k]
    //     // 找到拥有相同key值的可复用节点
    //     if (oldVNode.key === newVNode.key) {
    //       patch(oldVNode, newVNode, container)
    //       source[k - newStart] = i
    //     }
    //   }
    // }
    // 构建索引表
    const keyIndex = {}
    for (let i = newStart; i <= newEnd; i++) {
      keyIndex[newChildren[i].key] = i
    }
    // 新增patched变量，代表更新过的节点数量
    let patched = 0
    for (let i = oldStart; i <= oldEnd; i++) {
      oldVNode = oldChildren[i]
      if (patched < count) {
        // 通过索引表快速找到新的一组子节点中具有相同key值的节点位置
        const k = keyIndex[oldVNode.key]
        if (typeof k !== 'undefined') {
          newVNode = newChildren[k]
          patch(oldVNode, newVNode, container)
          // 每更新一个节点，都将patched变量+1
          patched++
          source[k - newStart] = i
          if (k < pos) {
            moved = true
          } else {
            pos = k
          }
        } else {
          // 没找到卸载
          unmount(oldVNode)
        }
      } else {
        // 如果更新过的节点数量大于需要更新的节点数量，则卸载多余的节点
        unmount(oldVNode)
      }
    }
    if (moved) {
      // 计算最长递增子序列
      const seq = getSequence(sources)
      // s指向最长递增子序列的最后一个元素
      let s = seq.length - 1
      // i指向新的一组子节点的最后一个元素
      let i = count - 1
      // for循环使得i递减
      for (i; i >= 0; i--) {
        if (source[i] === -1) {
          // 说明索引为i的节点是全薪的节点，应该将其挂载
          // 该节点在新children中的真实位置索引
          const pos = i + newStart
          const newVNode = newChildren[pos]
          // 该节点的下一个节点的位置索引
          const nextPos = pos + 1
          // 锚点
          const anchor = nextPos < newChildren.length ? newChildren[nextPos].el : null
          patch(null, newVNode, container, anchor)
        } else if (i !== seq[s]) {
          // 如果节点的索引i不等于seq[s]的值，说明该节点需要移动
          const pos = i + newStart
          const newVNode = newChildren[pos]
          // 该节点的下一个节点的位置索引
          const nextPos = pos + 1
          // 锚点
          const anchor = nextPos < newChildren.length ? newChildren[nextPos].el : null
          insert(newVNode.el, container, anchor)
        } else {
          // 当i === seq[s]时，说明该位置的节点不需要移动
          // 只需要让s指向下一个位置
          s--
        }
      }
    }
  }
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
      if (!n1) {
        // 挂载组件
        mountComponent(n2, container, anchor)
      } else {
        // 更新组件
        patchComponent(n1, n2, anchor)
      }
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
    } else if (typeof type === 'object' && type.__isTeleport) {
      // 组件选项中如果存在__isTeleport标识，则它是Teleport组件
      // 调用Teleport组件选项中的process函数将控制权交接出去
      // 传递给Process函数的第五个参数是渲染器的一些内部方法
      type.process(n1, n2, container, anchor, {
        patch,
        patchChildren,
        unmount,
        move(vnode, container, anchor) {
          insert(vnode.component ? vnode.component.subTree.el : vnode.el, container, anchor)
        }
      })
    } else if (['object', 'function'].includes(typeof type)) {
      // 有状态组件 函数式组件
      if (!n1) {
        // 如果该组件已经被keptAlive，则不会重新挂载它，而是会调用_activate来激活它
        if (n2.keptAlive) {
          n2.keepAliveInstance._activate(n2, container, anchor)
        } else {
          mountComponent(n2, container, anchor)
        }
      } else {
        patchComponent(n1, n2, anchor)
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

// resolveProps函数用于解析组件props和attrs数据
function resolveProps(options, propsData) {
  const props = {}
  const attrs = {}
  // 遍历为组件传递的props数据
  for (const key in propsData) {
    // 以字符串on开头的props,无论是否显示地声明，都将其添加到props数据中，而不是添加到attrs中
    if (key in options || key.startsWith('on')) {
      // 如果为组件传递的props数据在组件自身的props选项中有定义，则将其视为合法的props
      props[key] = propsData[key]
    } else {
      // 否则将其作为attrs
      attrs[key] = propsData[key]
    }
  }
  // 最后返回props与attrs数据
  return [props, attrs]
}
// 全局变量，存储当前正在被初始化的组件实例
let currentInstance = null
// 该方法接收组件实例作为参数，并将该实例设置为currentInstance
function setCurrentInstance(instance) {
  currentInstance = instance
}
function mountComponent(vnode, container, anchor) {
  // 检查是否是函数式组件
  const isFunctional = typeof vnode.type === 'function'
  // 通过vnode获取组件的选项对象，即vnode.type
  const componentOptions = vnode.type
  // 直接使用编译好的vnode.children对象作为slots对象即可
  const slots = vnode.children || {}
  if (isFunctional) {
    // 如果是函数式组件，则将vnode.type作为渲染函数，将vnode.type.props作为props选项定义即可
    componentOptions = {
      render: vnode.type,
      props: vnode.type.props
    }
  }
  // 获取组件的渲染函数render
  // 从组件选项对象中取出props定义，即propsOption
  const { render, data, setup, props: propsOptions, beforeCreate, created, beforeMount, mounted, beforeUpdate, updated } = componentOptions
  // 在这里调用beforeCreate钩子
  beforeCreate && beforeCreate()
  // 执行渲染函数，获取组件要渲染的内容，即render函数返回的虚拟DOM
  // 调用data函数得到原始数据，并调用reactive函数将其包装为响应式数据
  const state = data ? reactive(data()) : null

  // 调用resolveProps函数解析处最终的props数据与attrs数据
  const [props, attrs] = resolveProps(propsOption, vnode.props)

  // 定义组件实例，一个组件实例本质上就是有一个对象，它包含与组件有关的状态信息
  const instance = {
    // 组件自身的状态数据，即data
    state,
    // 将解析处的props数据包装为shallowReactive并定义到组件实例上
    props: shallowReactive(props),
    // 一个布尔值，用来表示组件是否已经被挂在，初始值为false
    isMounted: false,
    // 组件所渲染的内容，即子树(subTree)
    subTree: null,
    // 在组件实例中添加mounted数组，用来存储通过onMounted函数注册的生命周期钩子函数
    mounted: [],
    // 只有keepAlive组件的实例下会有keepAliveCtx属性
    keepAliveCtx: null
  }
  // 检查当前要挂在的组件是否是KeepAlive组件
  const isKeepAlive = vnode.type.__isKeepAlive
  if (isKeepAlive) {
    // 在KeepAlive组件实例上添加keepAliveCtx对象
    instance.keepAliveCtx = {
      // move函数用来移动一段vnode
      move(vnode, container, anchor) {
        // 本质上是将组件渲染的内容移动到指定容器中，即隐藏容器中
        insert(vnode.component.subTree.el, container, anchor)
      },
      createElemnt
    }
  }
  // 定义emit函数，它接收两个参数
  // event: 事件名称
  // payload: 传递给事件处理函数的参数
  function emit(event, ...payload) {
    // 根据约定对事件名称进行处理，例如change->onChange
    const eventName = `on${event[0].toUpperCase() + event.slice(1)}`
    // 根据处理后的事件名称去props中寻找对象的事件处理函数
    const handler = instance.props[eventName]
    if (handler) {
      // 调用事件处理函数并传递参数
      handler(...payload)
    } else {
      console.error('事件不存在')
    }
  }

  function onMounted(fn) {
    if (currentInstance) {
      currentInstance.mounted.push(fn)
    } else {
      console.error('onMounted函数只能在setup中调用')
    }
  }

  // setupContext, 由于我们还没有讲解emit和slots，所以暂时只需要attrs
  const setupContext = { attrs, emit, slots }
  // 在调用setup函数之前，设置当前组件实例
  setCurrentInstance(instance)

  // 调用setup函数，将只读版本的props作为第一个个参数传递，避免用户意外地修改props的值
  // 将setupContext作为第二个参数传递
  const setupResult = setup(shallowReadonly(instance.props), setupContext)
  // 在setup函数执行完毕之后，重置当前组件实例
  setCurrentInstance(null)

  // setupState用来存储由setup返回的数据
  let setupState = null
  // 如果setup函数的返回值是函数，则将其作为渲染函数
  if (typeof setupResult === 'function') {
    // 报告冲突
    if (render) console.error('setup函数返回渲染函数，render选项将被忽略')
    // 将setupResult作为渲染函数
    render = setupResult
  } else {
    // 如果setup的返回值不是函数，则作为数据状态赋值给setupState
    setupState = setupResult
  }

  // 将组件实例设置到vnode上，用于后续更新
  vnode.component = instance

  // 创建渲染上下文对象，本质上是组件实例的代理
  const renderContext = new Proxy(instance, {
    get(t, k, r) {
      // 取得组件自身状态与props数据
      const {state, props, slots} = t
      // 当k的值为$slots时，直接返回组件实例上的slots
      if (k === '$slots') return slots
      // 先尝试读取自身状态数据
      if (state && k in state) {
        return state[k]
      } else if (k in props) {
        // 如果组件自身没有该数据，则尝试从props中读取
        return props[k]
      } else {
        console.error('不存在')
      }
    },
    set(t, k, v, r) {
      const {state, props} = t
      if (state && k in state) {
        state[k] = v
      } else if (k in props) {
        console.warn('attempting')
      } else {
        console.error('不存在')
      }
    }
  })

  created && created.call(renderContext)
  // 调用render函数时，将其this设置为state,
  // 从而render函数内部可以通过this访问组件自身状态信息
  effect(() => {
    const subTree = render.call(renderContext, renderContext)
    // 检查组件是否已经被挂载
    if (!instance.isMounted) {
      beforeMount && beforeMount.call(state)
      // 初次挂载，调用patch函数第一个参数传递null
      patch(null, subTree, container, anchor)
      // 重点：将组件实例的isMounted设置为true,这样当更新发生时就不会再次进行挂载操作
      // 而是会执行更新
      instance.isMounted = true
      mounted && mounted.call(state)
      instance.mounted && instance.mounted.forEach(hook => hook.call(renderContext))
    } else {
      beforeUpdate && beforeUpdate.call(state)
      // 当isMounted为true时，说明组件已经被挂载，只需要完成自更新即可
      // 所以在调用patch函数时，第一个参数为组件上一个渲染的子树
      // 意思是，使用新的子树与上一次渲染的子树进行打补丁操作
      patch(instance.subTree, subTree, container, anchor)
      updated && updated.call(state)
    }
    instance.subTree = subTree
    // 最后调用patch 函数来载组件所描述的内容，即subTree
  }, {
    // 指定该副作用函数的调度器为queueJob即可
    scheduler: queueJob
  })
}

function patchComponent(n1, n2, anchor) {
  // 获取组件实例，即n1.component,同时让新的组件虚拟节点n2.component也指向组件实例
  const instance = (n2.component = n1.component)
  // 获取当前的props数据
  const { props } = instance
  // 调用hasPropsChanged检测为子组件传递的props是否发生变化，如果没有变化，则不需要更新
  if (hasPropsChanged(n1.props, n2.props)) {
    // 调用resolveProps函数重新获取props数据
    const [nextProps] = resolveProps(n2.type.props, n2.props)
    // 更新props
    for (const k in nextProps) {
      props[k] = nextProps[k]
    }
    // 删除不存在的props
    for (const k in props) {
      if (!(k in nextProps)) delete props[k]
    }
  }
}

function hasPropsChanged(prevProps, nextProps) {
  const nextKeys = Object.keys(nextProps)
  // 如果旧props的数量变了，则说明有变化
  if (nextKeys.length !== Object.keys(prevProps).length) return true
  for (let i = 0; i < nextKeys.length; i++) {
    const key = nextKeys[i]
    // 有不相等的props，则说明有变化
    if (nextKeys[key] !== prevProps[key]) return true
  }
  return false
}

// 任务缓存队列，用一个Set数据结构来表示，这样就可以自动对任务进行去重
const queue = new Set()
// 一个标志，代表是否正在刷新任务队列
let isFlushing = false
// 创建一个立即resolve的Promise实例
const p = Promise.resolve()

// 调度器的主要函数，用来将一个任务添加到缓冲队列中，并开始刷新队列
function queueJob(job) {
  // 将job添加到任务队列queue中
  queue.add(job)
  // 如果还没有开始刷新队列，则刷新之
  if (!isFlushing) {
    // 将该标志设置为true以避免重复刷新
    isFlushing = true
    // 在微任务中刷新缓冲队列
    p.then(() => {
      try {
        queue.forEach(job => job())
      } finally {
        isFlushing = false
        queue.clear = 0
      }
    })
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

renderer.render(MyComponent, document.querySelector('#app'))

const KeepAlive = {
  // KeepAlive组件独有的属性，用作表示
  __isKeepAlive: true,
  props: {
    include: RegExp,
    exclude: RegExp
  },
  setup(props, { slots }) {
    // 创建一个缓存对象
    // key: vnode.type
    // value: vnode
    const cache = new Map()
    // 当前KeepAlive组件的实例
    const instance = currentInstance
    // 对于KeepAlive组件来说，它的实例上存在特殊的keepAliveCtx对象，该对象由渲染器注入
    // 该对象会暴露渲染器的一些内部方法，其中move函数用来将一段DOM移动到另一个容器中
    const {move, createElement} = instance.keepAliveCtx

    // 创建隐藏容器
    const storageContainer = createElement('div')

    // KeepAlive组件的实例上会被添加两个内部函数，分别是_deActivate 和 _activate
    // 这两个函数会在渲染器中被调用
    instance._deActivate = (vnode) => {
      move(vnode, storageContainer)
    }
    instance._activate = (vnode, container, anchor) => {
      move(vnode, container, anchor)
    }

    return () => {
      // KeepAlive的默认插槽就是要被keepAlive的组件
      let rawVNode = slots.default()
      // 如果不是组件，直接渲染即可，因为非组件的虚拟节点无法被KeepAlive
      if (typeof rawVNode.type !== 'object') {
        return rawVNode
      }

      // 获取内部组件的name
      const name = rawVNode.type.name
      // 对name进行匹配
      if (name &&
        (
          // 如果name无法被include匹配
          (props.include && !props.include.test(name)) ||
          // 或者被exclude匹配
          (props.exclude && props.exclude.test(name))
        )) {
          // 则直接渲染内部组件，不对其进行后续的缓存操作
          return rawVNode
        }
      // 在挂载时先获取缓存的组件vnode
      const cachedVNode = cache.get(rawVNode.type)
      if (cachedVNode) {
        // 如果有缓存的内容，则说明不应该执行挂载，而应该执行激活
        // 继承组件实例
        rawVNode.component = cachedVNode.component
        // 在vnode上添加keptAlive属性，标记为true，避免渲染器重新挂载它
        rawVNode.keptAlive = true
      } else {
        // 如果没有缓存，则将其添加到缓存中，这样下次激活组件时就不会执行新的挂载动作了
        cache.set(rawVNode.type, rawVNode)
      }

      // 在组件vnode上添加shouldKeepAlive属性，并标记为true，避免渲染器真的将组件卸载
      rawVNode.shouldKeepAlive = true
      // 将KeepAlive组件的实例也添加到vnode上，以便在渲染器中访问
      rawVNode.keepAliveInstance = instance
      return rawVNode
    }
  }
}

const _cache = new Map()
const cache: KeepAliveCache = {
  get(key) {
    _cache.get(key)
  },
  set(key, value) {
    _cache.set(key, value)
  },
  delete(key) {
    _cache.delete(key)
  },
  forEach(fn) {
    _cache.forEach(fn)
  }
}