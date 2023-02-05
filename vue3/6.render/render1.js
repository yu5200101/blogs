const { effect, ref } = VueReactivity

const count = ref(1)
const bool = ref(false)

effect(() => {
  renderer(`<h1>${count.value}</h1>`, document.getElementById('app'))
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
  const parent = vnode.el.parentNode
  if (parent) {
    parent.removeChild(vnode.el)
  }
}
function createRenderer(options) {
  const {
    createElement,
    insert,
    setElementText
  } = options
  // 在这个作用域内定义的函数都可以访问那些API
  function mountElement(vnode, container) {
    const el = vnode.el = createElement(vnode.type)
    if (typeof vnode.children === 'string') {
      setElementText(el, vnode.children)
    }
    // container.appendChild(el)
    else if (Array.isArray(vnode.children)) {
      vnode.children.forEach(child => {
        patch(null, child, el)
      })
    }
    if(vnode.props) {
      // 遍历vnode.props
      for(const key in vnode.props) {
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
      // 如果新旧vnode的类型不同，则直接将旧vnode卸载
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
    } else if (type === 'xxx') {
      // 处理其他类型的vnode
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
  function hydrate(vnode, container) {}
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
          invoker = el.vei[key] = (e) => {
            // 当伪造的事件处理函数执行时，会执行真正的事件处理函数
            invoker.value(e)
          }
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
