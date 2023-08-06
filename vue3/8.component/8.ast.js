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
    mode: TextModes.DATA,
    advanceBy(num) {
      // 根据给定字符数num,截取位置num后的模板内容，并替换当前模板内容
      context.source = context.source.slice(num)
    },
    advanceSpace() {
      const match = /^[\t\r\n\f\s]+/.exec(context.source)
      if (match) {
        // 调用advanceBy函数消费空白字符
        context.advanceBy(match[0].length)
      }
    }
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

function parseText(context) {
  // endIndex为文本内容的结尾索引，默认将整个模板剩余内容都作为文本内容
  let endIndex = context.source.length
  // 寻找字符<的位置索引
  const ltIndex = context.source.indexOf('<')
  const delimiterIndex = context.source.indexOf('{{')

  // 取ltIndex和当前endIndex中较小的一个作为新的结尾索引
  if (ltIndex > -1 && ltIndex < endIndex) {
    endIndex = ltIndex
  }
  // 取delimiterIndex和当前endIndex中较小的一个作为新的结尾索引
  if (delimiterIndex > -1 && delimiterIndex < endIndex) {
    endIndex = delimiterIndex
  }

  // 此时endIndex是最终的文本内容的结尾索引，调用slice函数截取文本内容
  const content = context.source.slice(0, endIndex)
  // 消耗文本内容
  context.advanceBy(content.length)

  return {
    type: 'Text',
    content: decodeHtml(content)
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

function parseAttributes(context) {
  // 用来存储解析过程中的属性节点和指令节点
  const props = []

  // 开启while循环，不断地消费模板内容，直至遇到标签的“结束部分”为止
  while(
    !context.source.startsWith('>') &&
    !context.source.startsWith('/>')
  ) {
    const match = /^[^\t\r\n\f />][^\t\r\n\f />=]*/.exec(context.source)
    // 解析属性或指令
    const name = match[0]
    // 消费属性名称
    advanceBy(name.length)
    // 消费属性名称与等于号之间的空白字符
    advanceSpaces()
    // 消费等于号
    advanceBy(1)
    // 消费等于号与属性值之间的空白字符
    advanceSpaces()

    let value = ''

    // 获取当前模板内容的第一个字符
    const quote = context.source[0]
    // 判断属性值是否被引号引用
    const isQuoted = ['"', "'"].includes(quote)

    if (isQuoted) {
      // 属性值被引号引用，消费引号
      advanceBy(1)
      // 获取下一个引号的索引
      const endQuoteIndex = context.source.indexOf(quote)
      if (endQuoteIndex > -1) {
        // 获取下一个引号之前的内容作为属性值
        value = context.source.slice(0, endQuoteIndex)
        // 消费属性值
        advanceBy(value.length)
        // 消费引号
        advanceBy(1)
      } else {
        console.error('缺少引号')
      }
    } else {
      // 此处说明属性值没有被引号引用
      // 下一个空白字符之前的内容全部作为属性值
      const match = /^[^\t\r\n\f >]+/.exec(context.source)
      // 获取属性值
      value = match[0]
      advanceBy(value.length)
    }
    // 消费属性值后面的空白字符
    advanceSpaces()
    // 使用属性名称+属性值创建一个属性节点，添加到props数组中
    props.push({
      type: 'Attribute',
      name,
      value
    })
  }
  return props
}
// 由于parseTag既用来处理开始标签，也用来处理结束标签，因此我们设计第二个参数type
// 用来代表当前处理的是开始标签还是结束标签，type的默认值为'start'，即默认作为开始标签处理
function parseTag(context, type = 'start') {
  // 从上下文对象中拿到advanceBy函数
  const { advanceBy, advanceSpaces } = context
  // 处理开始标签和结束标签的正则表达式不同
  // 匹配开始标签和匹配结束标签
  const match = type === 'start' ? /^<([a-z][^\t\r\n\f />]*)/i.exec(context.source) : /^<\/([a-z][^\t\r\n\f />]*)/i.exec(context.source)
  // 匹配成功后，正则表达式的第一个捕获组的值就是标签名称
  const tag = match[1]
  // 消费正则表达式匹配的全部内容，例如div这段内容
  advanceBy(match[0].length)
  // 消费标签中无用的空白字符
  advanceSpaces()
  // 调用parseAttributes函数完成属性与指令的解析，并得到props数组，
  // props数组是由指令节点与属性节点共同组成的数组
  const props = parseAttribute(context)
  const isSelfClosing = context.source.startWith('/>')
  // 如果是自闭合标签，则消费 '/>'否则消费'>'
  advanceBy(isSelfClosing ? 2 : 1)
  return {
    type: 'Element',
    props: [],
    tag,
    props,
    children: [],
    isSelfClosing
  }
}

function parseElement(context, ancestors) {
  const element = parseTag(context)
  if (element.isSelfClosing) return element

  // 切换到正确的文本模式
  if (['textarea', 'title'].includes(element.tag)) {
    // 如果由parseTag解析得到的标签是<textarea>或<title>,则切换到RCDATA模式
    context.mode = TextModes.RCDATA
  } else if (/style|xmp|iframe|noembed|noframes|noscript/.text(element.tag)) {
    // 如果由parseTag解析得到的标签是/style|xmp|iframe|noembed|noframes|noscript
    // 则切换到RAWTEXT模式
    context.mode = TextModes.DATA
  }
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

// 第一个参数为要被解码的文本内容
// 第二个参数是一个布尔值，代表文本内容是否作为属性值
function decodeHtml(rawText, asAttr = false) {
  let offset = 0
  const end = rawText.length
  // 经过解码后的文本将作为返回值被返回
  let decodedText = ''
  // 引用表中实体名称的最大长度
  let maxCRNameLength = 0

  // advance函数用于消费指定长度的文本
  function advance(length) {
    offset += length
    rawText = rawText.slice(length)
  }

  // 消费字符串，直到处理完毕为止
  while(offset < end) {
    // 用于匹配字符引用的开始部分，如果匹配成，那么head[0]的值将有三种可能
    // head[0] === '&'这说明该字符引用是命名字符引用
    // head[0] === '&#'这说明该字符引用是用十进制表示的数字字符引用
    // head[0] === '&#x'这说明该字符引用是用十六进制表示的数字字符引用
    const head = /&(?:#x?)?/i.exec(rawText)
    if (!head) {
      // 计算剩余内容的长度
      const remaining = end - offset
      // 将剩余内容加到decodedText上
      decodedText += rawText.slice(0, remaining)
      // 消费剩余内容
      advance(remaining)
      break
    }

    // head.index为匹配的字符&在rawText中的位置索引
    // 截取字符&之前的内容加到decodedText上
    // 消费字符&之前的内容
    advance(head.index)

    if(head[0] === '&') {
      let name = ''
      let value = ''
      // 字符&的下一个字符必须是ASCII字母或数字，这样才是合法的命名字符引用
      if (/[0-9a-z]/i.test(rawText[1])) {
        // 根据引用表计算实体名称的最大长度
        if (!maxCRNameLength) {
          maxCRNameLength = Object.keys(namedCharacterReferences).reduce((max, name) => Math.max(max, name.length), 0)
        }
        // 从最大长度开始对文本进行截取，并试图去引用表中找到对应的项
        for (let length = maxCRNameLength; !value && length > 0; --length) {
          // 截取字符&到最大长度之间的字符作为实体名称
          name = rawText.substr(1, length)
          // 使用实体名称去索引表中查找对应项的值
          value = (namedCharacterReferences)[name]
        }
        // 如果找到了对应项的值，说明解码成功
        if (value) {
          // 检查实体名称的最后一个匹配字符是否是分号
          const semi = name.endsWith(';')
          // 如果解码的文本作为属性值，最后一个匹配的字符不是分号
          // 并且最后一个匹配字符的下一个字符是等于号，ASCII字母或数字
          // 由于历史原因，将字符&和实体名称name作为普通文本
          if (asAttr &&
            !semi &&
            /[=a-z0-9]/i.test(rawText[name.length + 1] || '')) {
              decodedText += '&' + name
              advance(1 + name.length)
            } else {
              // 其他情况下，正常使用解码后的内容拼接到decodedText上
              decodedText += value
              advance(1 + name.length)
            }
        } else {
          // 如果没有找到对应的值，说明解码失败
          decodedText += '&' + name
          advance(1 + name.length)
        }
      } else {
        // 如果字符&的下一个字符不是ASCII字母或数字，则将字符&作为普通文本
        decodedText += '&'
        advance(1)
      }
    }
  }
  return decodedText
}