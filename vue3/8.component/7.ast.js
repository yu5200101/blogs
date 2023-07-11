const TextModes = {
  DATA: 'DATA',
  RCDATA: 'RCDATA',
  RAWTEXT: 'RAWTEXT',
  CDATA: 'CDATA'
}

// 解析器函数，接收模板作为参数
function parse(str) {
  const context = {
    // source是模板内容，用于在解析过程中进行消费
    source: str,
    // 解析器当前处于文本模式，初始模式为DATA
    mode: TextModes.DATA
  }
  // 调用parseChildren 函数开始进行解析，它返回解析后得到的子节点
  // parseChildren 函数接收两个参数
  // 第一个参数是上下文对象context
  // 第二个参数是由父代节点构成的节点栈，初始时栈为空
  const nodes = parseChildren(context, [])

  // 解析器返回Root根节点
  return {
    type: 'Root',
    // 使用nodes作为根节点的children
    children: nodes
  }
}

function parseChildren(context, ancestors) {
  // 定义nodes数组存储子节点，它将作为最终的返回值
  let nodes = []
  // 从上下文对象中取得当前状态，包括模式mode和模板内容source
  const { mode, source } = context
  // 开启while循环，只要满足条件就会一直对字符串进行解析
  while (!isEnd(context, ancestors)) {
    let node
    // 只有DATA模式和RCDATA模式才支持插值节点的解析
    if (mode === TextModes.DATA || mode === TextModes.RCDATA) {
      // 只有DATA模式才支持标签节点的解析
      if (mode === TextModes.DATA && source[0] === '<') {
        if (source[1] === '!') {
          if (source.startsWith('<!--')) {
            node = parseComment(context)
          } else if (source.startsWith('<![CDATA[')) {
            node = parseCDATA(context, ancestors)
          }
        } else if (source[1] === '/') {
          // 结束标签，这里需要抛出错误，后文会详细解释原因
        } else if (/[a-z]/i.test(source[1])) {
          node = parseElement(context, ancestors)
        }
      } else if (source.startsWith('{{')) {
        // 解析插值
        node = parseInterpolation(context)
      }
    }

    // node不存在，说明处于其他模式，即非DATA模式且非RCDATA模式
    // 这时一切内容都作为文本处理
    if (!node) {
      node = parseText(context)
    }
    // 将节点添加到nodes数组中
    nodes.push(node)
  }
  return nodes
}

function parseElement(context, ancestors) {
  const element = parseTag(context)
  if (element.isSelfClosing) return element
  ancestors.push(element)
  element.children = parseChildren(context, ancestors)
  ancestors.pop()

  if (context.source.startsWith(`</${element.tag}`)) {
    parseTag(context, 'end')
  } else {
    console.error(`${element.tag}标签缺少闭合标签`)
  }
  return element
}
 
function isEnd(context, ancestors) {
  // 当模板内容解析完毕后，停止
  if (!context.source) return true
  for (let i = ancestors.length - 1; i >= 0; --i) {
    // 只要栈中存在与当前结束标签同名的节点，就停止状态机
    if (context.source.startsWith(`</${ancestors[i].tag}`)) {
      return true
    }
  }
  // 获取父级标签节点
  const parent = ancestors[ancestors.length - 1]
  // 如果遇到结束标签，并且该标签与父级标签节点同名，则停止
  if (parent && context.source.startsWith(`</${parent.tag}`)) {
    return true
  }
}