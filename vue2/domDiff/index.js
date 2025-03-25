// 虚拟DOM节点类
class VNode {
  constructor(tag, data, children, text, elm) {
      this.tag = tag
      this.data = data || {}
      this.children = children
      this.text = text
      this.elm = elm
      this.key = data && data.key
  }
}

// 创建元素节点
function createElement(tag, data, children) {
  if (Array.isArray(children) && children.length === 1 && typeof children[0] === 'string') {
      return new VNode(tag, data, undefined, children[0])
  }
  return new VNode(tag, data, normalizeChildren(children))
}

// 创建文本节点
function createTextNode(text) {
  return new VNode(undefined, undefined, undefined, text)
}

// 规范化子节点
function normalizeChildren(children) {
  if (!children) return undefined
  if (typeof children === 'string') return [createTextNode(children)]
  return children
}

// 判断是否是相同节点
function sameVNode(a, b) {
  return (
      a.key === b.key &&
      a.tag === b.tag &&
      (!!a.data) === (!!b.data) &&
      sameInputType(a, b)
  )
}

// 判断是否是相同类型的input元素
function sameInputType(a, b) {
  if (a.tag !== 'input') return true
  const aType = a.data && a.data.attrs && a.data.attrs.type
  const bType = b.data && b.data.attrs && b.data.attrs.type
  return aType === bType
}

// 将虚拟DOM渲染为真实DOM
function createElm(vNode) {
  if (vNode.text !== undefined) {
      vNode.elm = document.createTextNode(vNode.text)
      return vNode.elm
  }
  const el = document.createElement(vNode.tag)
  // 设置属性
  const { attrs = {}, on = {} } = vNode.data
  Object.keys(attrs).forEach(key => {
      el.setAttribute(key, attrs[key])
  })
  // 添加事件
  Object.keys(on).forEach(event => {
      el.addEventListener(event, on[event])
  })
  // 递归创建子节点
  if (vNode.children) {
      vNode.children.forEach(child => {
          el.appendChild(createElm(child))
      })
  }
  vNode.elm = el
  return el
}
// 当数据发生变化时，订阅者watcher会调用patch给真实的dom打补丁
// 核心patch函数
function patch(oldVNode, vNode) {
  log('开始patch过程')
  // 1. 没有新节点，直接触发旧节点的destroy钩子
  if (!vNode) {
      log('没有新节点，触发旧节点销毁')
      if (oldVNode) invokeDestroyHook(oldVNode)
      return
  }
  let isInitialPatch = false
  const insertedVNodeQueue = []
  // 2. 没有旧节点，直接创建新节点
  if (!oldVNode) {
      log('没有旧节点，初始化创建')
      isInitialPatch = true
      createElm(vNode, insertedVNodeQueue)
  }
  // 3. 新旧节点相同，调用patchVNode
  else if (sameVNode(oldVNode, vNode)) {
      log('新旧节点相同，调用patchVNode')
      patchVNode(oldVNode, vNode, insertedVNodeQueue)
  }
  // 4. 新旧节点不同，创建新节点，删除旧节点
  else {
      log('新旧节点不同，替换节点')
      const oldElm = oldVNode.elm
      const parentElm = oldElm.parentNode
      // 创建新节点
      createElm(vNode, insertedVNodeQueue)
      // 插入新节点，删除旧节点
      if (parentElm !== null) {
          parentElm.insertBefore(vNode.elm, oldElm)
          removeVNodes([oldVNode], 0, 0)
      }
  }
  return vNode.elm
}

// patchVNode函数
function patchVNode(oldVNode, vNode, insertedVNodeQueue) {
  if (oldVNode === vNode) {
      log('新旧节点引用相同，无需更新')
      return
  }
  const elm = vNode.elm = oldVNode.elm
  const oldCh = oldVNode.children
  const ch = vNode.children
  // 1. 新节点是文本节点
  if (vNode.text !== undefined) {
      if (oldVNode.text !== vNode.text) {
          log(`1.更新文本: "${oldVNode.text}" => "${vNode.text}"`)
          elm.textContent = vNode.text
      }
  }
  // 2. 新旧节点都有子节点
  else if (oldCh && ch) {
      if (oldCh !== ch) {
          log('2.新旧节点都有子节点，调用updateChildren')
          updateChildren(elm, oldCh, ch, insertedVNodeQueue)
      }
  }
  // 3. 只有新节点有子节点
  else if (ch) {
      log('3.只有新节点有子节点，添加新子节点')
      if (oldVNode.text !== undefined) elm.textContent = ''
      addVNodes(elm, null, ch, 0, ch.length - 1, insertedVNodeQueue)
  }
  // 4. 只有旧节点有子节点
  else if (oldCh) {
      log('4.只有旧节点有子节点，移除旧子节点')
      removeVNodes(oldCh, 0, oldCh.length - 1)
  }
  // 5. 旧节点是文本节点
  else if (oldVNode.text !== undefined) {
      log('5.旧节点是文本节点，清空内容')
      elm.textContent = ''
  }
}

// updateChildren函数（完整双端比较算法）
function updateChildren(parentElm, oldCh, newCh, insertedVNodeQueue) {
  let oldStartIdx = 0
  let newStartIdx = 0
  let oldEndIdx = oldCh.length - 1
  let newEndIdx = newCh.length - 1
  let oldStartVNode = oldCh[oldStartIdx]
  let oldEndVNode = oldCh[oldEndIdx]
  let newStartVNode = newCh[newStartIdx]
  let newEndVNode = newCh[newEndIdx]
  let oldKeyToIdxMap, idxInOld, vNodeToMove, refElm

  while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
      // 跳过已处理节点
      // oldCh第一个节点不存在
      if (!oldStartVNode) {
          oldStartVNode = oldCh[++oldStartIdx]
      }
      // oldCh最后一个节点不存在
      else if (!oldEndVNode) {
          oldEndVNode = oldCh[--oldEndIdx]
      }
      // 1. 旧开始 vs 新开始
      else if (sameVNode(oldStartVNode, newStartVNode)) {
          log('情况1: 旧开始节点与新开始节点相同')
          patchVNode(oldStartVNode, newStartVNode, insertedVNodeQueue)
          oldStartVNode = oldCh[++oldStartIdx]
          newStartVNode = newCh[++newStartIdx]
      }
      // 2. 旧结束 vs 新结束
      else if (sameVNode(oldEndVNode, newEndVNode)) {
          log('情况2: 旧结束节点与新结束节点相同')
          patchVNode(oldEndVNode, newEndVNode, insertedVNodeQueue)
          oldEndVNode = oldCh[--oldEndIdx]
          newEndVNode = newCh[--newEndIdx]
      }
      // 3. 旧开始 vs 新结束
      else if (sameVNode(oldStartVNode, newEndVNode)) {
          log('情况3: 旧开始节点与新结束节点相同，移动节点到末尾')
          patchVNode(oldStartVNode, newEndVNode, insertedVNodeQueue)
          parentElm.insertBefore(
              oldStartVNode.elm,
              oldEndVNode.elm.nextSibling
          )
          oldStartVNode = oldCh[++oldStartIdx]
          newEndVNode = newCh[--newEndIdx]
      }
      // 4. 旧结束 vs 新开始
      else if (sameVNode(oldEndVNode, newStartVNode)) {
          log('情况4: 旧结束节点与新开始节点相同，移动节点到开头')
          patchVNode(oldEndVNode, newStartVNode, insertedVNodeQueue)
          parentElm.insertBefore(oldEndVNode.elm, oldStartVNode.elm)
          oldEndVNode = oldCh[--oldEndIdx]
          newStartVNode = newCh[++newStartIdx]
      }
      // 5. 其他情况：使用key查找
      else {
          log('情况5: 使用key查找可复用节点')
          // 创建旧节点key到index的映射表
          if (!oldKeyToIdxMap) {
            oldKeyToIdxMap = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx)
          }
          // 查找新开始节点在旧节点中的位置
          idxInOld = oldKeyToIdxMap[newStartVNode.key]
          if (!idxInOld) {
              // 没有找到相同key，创建新节点
              log(`情况5: 创建新节点: ${newStartVNode.tag || '文本'}`)
              createElm(newStartVNode, insertedVNodeQueue)
              parentElm.insertBefore(newStartVNode.elm, oldStartVNode.elm)
          } else {
              // 找到相同key的节点
              vNodeToMove = oldCh[idxInOld]
              if (sameVNode(vNodeToMove, newStartVNode)) {
                  log(`情况5: 复用key=${newStartVNode.key}的节点`)
                  patchVNode(vNodeToMove, newStartVNode, insertedVNodeQueue)
                  oldCh[idxInOld] = undefined // 标记已处理
                  parentElm.insertBefore(vNodeToMove.elm, oldStartVNode.elm)
              } else {
                  // 相同key但不同元素，创建新节点
                  log(`情况5: key冲突，创建新节点: ${newStartVNode.tag}`)
                  createElm(newStartVNode, insertedVNodeQueue)
                  parentElm.insertBefore(newStartVNode.elm, oldStartVNode.elm)
              }
          }
          newStartVNode = newCh[++newStartIdx]
      }
  }

  // 循环结束后的处理
  if (oldStartIdx > oldEndIdx) {
      // 添加剩余的新节点
      refElm = newCh[newEndIdx + 1] ? newCh[newEndIdx + 1].elm : null
      log('添加剩余新节点')
      addVNodes(
          parentElm,
          refElm,
          newCh,
          newStartIdx,
          newEndIdx,
          insertedVNodeQueue
      )
  } else if (newStartIdx > newEndIdx) {
      // 删除剩余的旧节点
      log('删除剩余旧节点')
      removeVNodes(oldCh, oldStartIdx, oldEndIdx)
  }
}

// 创建key到旧节点索引的映射表
function createKeyToOldIdx(children, beginIdx, endIdx) {
  const map = {}
  for (let i = beginIdx; i <= endIdx; ++i) {
      const key = children[i]?.key
      if (key !== undefined) {
          map[key] = i
      }
  }
  return map
}

// 添加节点
function addVNodes(parentElm, refElm, vNodes, startIdx, endIdx, insertedVNodeQueue) {
  for (; startIdx <= endIdx; ++startIdx) {
      createElm(vNodes[startIdx], insertedVNodeQueue)
      if (refElm) {
          parentElm.insertBefore(vNodes[startIdx].elm, refElm)
      } else {
          parentElm.appendChild(vNodes[startIdx].elm)
      }
  }
}

// 移除节点
function removeVNodes(vNodes, startIdx, endIdx) {
  for (; startIdx <= endIdx; ++startIdx) {
      const ch = vNodes[startIdx]
      if (ch?.elm) {
          log(`移除节点: ${ch.tag || '文本(${ch.text})'}`)
          ch.elm.parentNode?.removeChild(ch.elm)
      }
  }
}

// 触发销毁钩子（示例实现）
function invokeDestroyHook(vNode) {
  // 实际Vue实现中会调用组件的beforeDestroy/destroyed等生命周期钩子
  log(`触发销毁钩子: ${vNode.tag || '文本(${vNode.text})'}`)
  if (vNode.children) {
      vNode.children.forEach(child => invokeDestroyHook(child))
  }
}

// 日志记录函数
function log(message) {
  const logElement = document.getElementById('diffLog')
  const entry = document.createElement('div')
  entry.className = 'log-entry'
  entry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`
  logElement.appendChild(entry)
  logElement.scrollTop = logElement.scrollHeight
}

// 示例使用
document.addEventListener('DOMContentLoaded', () => {
  const diffLogElement = document.getElementById('diffLog')
  const oldDomElement = document.getElementById('oldDom')
  const newDomElement = document.getElementById('newDom')
  const resultDomElement = document.getElementById('resultDom')
  // 创建旧虚拟DOM
  const oldVNode = createElement(
    'div',
    { attrs: { id: 'app' } },
    [
      createElement(
        'h1',
        { attrs: { class: 'title' } },
        ['旧标题']
      ),
      createElement(
        'ul',
        { attrs: { class: 'list' } },
        [
          createElement(
            'li',
            { attrs: { key: '1', class: 'item' } },
            ['项目1']
          ),
          createElement(
            'li',
            { attrs: { key: '2', class: 'item' } },
            ['项目2']
          ),
          createElement(
            'li',
            { attrs: { key: '3', class: 'item' } },
            ['项目3']
          )
        ]
      ),
      createElement(
        'p',
        {},
        ['这是一段旧文本']
      )
    ]
  )
  // 创建新虚拟DOM
  const newVNode = createElement(
    'div',
    { attrs: { id: 'app' } },
    [
      createElement(
        'h1',
        { attrs: { class: 'title new-title' } },
        ['新标题']
      ),
      createElement(
        'ul',
        { attrs: { class: 'list' } },
        [
          createElement(
            'li',
            { attrs: { key: '4', class: 'item' } },
            ['项目4']
          ),
          createElement(
            'li',
            { attrs: { key: '1', class: 'item' } },
            ['项目1(更新)']
          ),
          createElement(
            'li',
            { attrs: { key: '3', class: 'item' } },
            ['项目3']
          )
        ]
      ),
      createElement(
        'p',
        {},
        ['这是一段新文本']
      )
    ]
  )
  // 渲染初始DOM
  oldDomElement.appendChild(createElm(oldVNode))
  newDomElement.appendChild(createElm(newVNode))
  resultDomElement.appendChild(createElm(oldVNode))
  // 执行Diff比较
  document.getElementById('btnDiff').addEventListener('click', () => {
      patch(oldVNode, newVNode)
  })
  // 重置
  document.getElementById('btnReset').addEventListener('click', () => {
      oldDomElement.innerHTML = ''
      newDomElement.innerHTML = ''
      resultDomElement.innerHTML = ''
      diffLogElement.innerHTML = ''
      oldDomElement.appendChild(createElm(oldVNode))
      newDomElement.appendChild(createElm(newVNode))
      resultDomElement.appendChild(createElm(oldVNode))
      alert('已重置！')
  })
})