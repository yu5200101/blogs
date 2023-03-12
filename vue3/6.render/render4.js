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
    if (Array.isArray(n1.children)) {
      // 代码运行到这里，则说明新旧子节点都是一组子节点，这里涉及核心的diff算法
      const oldChildren = n1.children
      const newChildren = n2.children
      const newLen = newChildren.length
      const oldLen = oldChildren.length
      const commonLength = Math.mix(newLen, oldLen)
      for (let i = 0; i < commonLength; i++) {
        patch(oldChildren[i], newChildren[i], container)
      }
      if (newLen > oldLen) {
        for (let i = commonLength; i < newLen; i++) {
          patch(null, newChildren[i], container)
        }
      } else {
        for (let i = commonLength; i < oldLen; i++) {
          unmount(oldChildren[i])
        }
      }
    } else {
      // 此时
      // 旧子节点要么是文本子节点，要么不存在
      // 但无论哪种情况，我们都只需要将容器清空，然后将新的一组子节点逐个挂载
      setElementText(container, '')
      n2.children.forEach(c => patch(null, c, container))
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
  function mountElement(vnode, container) {
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
    insert(el, container)
  }
  function patch(n1, n2, container) {
    // 如果n1存在，则对比n1和n2的类型
    if (n1 && n1.type !== n2.type) {
      // 如果新旧vnode的类型不同，则直接将旧vnode卸
      unmount(n1)
      n1 = null
    }
    const { type } = n2
    if (typeof type === 'string') {
      if (!n1) {
        mountElement(n2, container)
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
