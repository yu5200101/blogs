// parse函数接收模板作为参数
function parse(str) {
  // 首先对模板进行标记化，得到tokens
  const tokens = tokenize(str)
  // 创建Root根节点
  const root = {
    type: 'Root',
    children: []
  }
  // 创建 elementStack栈，起初只有Root根节点
  const elementStack = [root]
  // 开启一个while循环扫描tokens，直到所有token都被扫描完毕为止
  while(tokens.length) {
    // 获取当前栈顶节点作为父节点parent
    const parent = elementStack[elementStack.length - 1]
    // 当前扫描的token
    const t = tokens[0]
    switch(t.type) {
      case 'tag':
        // 如果当前Token是开始标签，则创建Element类型的AST节点
        const elementNode = {
          type: 'Element',
          tag: t.name,
          children: []
        }
        // 将其添加到父级节点的children中
        parent.children.push(elementNode)
        // 将当前节点压入栈
        elementStack.push(elementNode)
        break
      case 'text':
        // 如果当前Token是文本，则创建Text类型的AST节点
        const textNode = {
          type: 'Text',
          content: t.content
        }
        // 将其添加到父节点的children中
        parent.children.push(textNode)
        break
      case 'tagEnd':
        // 遇到结束标签，将栈顶节点弹出
        elementStack.pop()
        break
    }
    // 消费已经扫描过的token
    tokens.shift()
  }
  return root
}

function dump(node, indent = 0) {
  // 节点的类型
  const type = node.type
  // 节点的描述，如果是根节点，则没有描述
  // 如果是Element类型的节点，则使用node.tag作为节点的描述
  // 如果是Text类型的节点，则使用node.content作为节点的描述
  let desc = ''
  if ( node.type === 'Root') {
    desc = ''
  } else if (node.type === 'Element') {
    desc = node.tag
  } else {
    desc = node.content
  }
  // 打印节点的类型和描述信息
  console.log(`${'-'.repeat(indent)}${type} : ${desc}`)

  // 递归打印子节点
  if (node.children) {
    node.children.forEach(n => dump(n, indent + 2))
  }
}
const ast = parse(`<div><p>Vue</p><p>Template</p></div>`)
console.log(dump(ast))

// 接收第二个参数 context
function traverseNode(ast, context) {

  // 设置当前转换的节点信息 context.currentNode
  context.currentNode = ast
  // 当前节点，ast本身就是Root节点
  const currentNode = ast

  // 增加退出阶段的回调函数数组
  const exitFns = []

  // context.nodeTransforms是一个数组，其中每一个元素都是一个函数
  const transforms = context.nodeTransforms
  for (let i = 0; i < transforms.length; i++) {
    // 将当前节点currentNode和context都传递给nodeTransforms中注册的回调函数
    const onExit = transforms[i](currentNode, context)

    if (onExit) {
      // 将退出阶段的回调函数添加到exitFns数组中
      exitFns.push(onExit)
    }
    if (!currentNode) return
  }

  // 如果有子节点，则递归地调用traverseNode函数进行遍历
  const children = currentNode.children
  if (children) {
    for (let i = 0; i < children.length; i++) {
      // 递归地调用traverseNode转换子节点之前，将当前节点设置为父节点
      context.parent = currentNode
      // 设置位置索引
      context.childIndex = i
      // 递归地调用时，将context透传
      traverseNode(children[i], context)
    }
  }

  let i = exitFns.length
  while(i--) {
    exitFns[i]()
  }
}
function transformElement(node, context) {
  // if (node.type === 'Element' && node.tag === 'p') {
  //   node.tag = 'h1'
  // }
  // 返回一个会在退出节点时执行的回调函数
  return () => {
    // 编写退出节点的逻辑
    if (node.type !== 'Element') {
      return
    }

    // 1创建h函数调用语句
    // h函数调用的第一个参数是标签名称，因此我们以node.tag来创建一个字符串字面量节点作为第一个参数
    const callExp = createCallExpression('h', [
      createStringLiteral(node.tag)
    ])
    // 2处理h函数调用的参数
    const arrayExpression = createArrayExpression(node.children.map(c => c.jsNode))
    node.children.length === 1 ? callExp.arguments.push(node.children[0].jsNode) : callExp.arguments.push(arrayExpression)
    // 3将当前标签节点对应的javascript AST 添加到jsNode属性下
    node.jsNode = callExp
  }
}

function transformText(node, context) {
  // if (node.type === 'Text') {
  //   // 如果当前转换的节点是文本节点，则调用context.replaceNode函数将其替换为元素节点
  //   context.replaceNode({
  //     type: 'Element',
  //     tag: 'span'
  //   })
  //   // node.content = node.content.repeat(2)
  //   context.remove()
  // }
  if (node.type !== 'Text') {
    return
  }
  // 文本节点对应的javascript ast节点其实就是一个字符串字面量
  // 因此只需要使用node.content创建一个stringLiteral类型的节点即可
  // 最后将文本节点对应的javascript ast节点添加到node.jsNode属性下
  node.jsNode = createStringLiteral(node.content)
}

// 封装transform函数，用来对AST进行转换
function transform(ast) {
  // 在transform函数内创建context对象
  const context = {
    // 增加currentNode,用来存储当前正在转换的节点
    currentNode: null,
    // 增加childIndex,用来存储当前节点在父节点的children中的位置索引
    childIndex: 0,
    // 增加parent,用来存储当前转换节点的父节点
    parent: null,
    replaceNode(node) {
      // 找到当前节点在父节点的children中的位置：context.childIndex
      // 然后使用新节点替换即可
      context.parent.children[context.childIndex] = node
      // 由于当前节点已经被新节点替换了，因此需要将currentNode更新为新节点
      context.currentNode = node
    },
    removeNode() {
      if (context.parent) {
        context.parent.children.splice(context.childIndex, 1)
        context.currentNode = null
      }
    },
    // 注册nodeTransforms数组
    nodeTransforms: [
      // transformElement 函数用来转换标签节点
      transformElement,
      // transformText函数用来转换文本节点
      transformText
    ]
  }
  // 调用traverseNode完成转换
  traverseNode(ast, context)
  // 打印AST信息
  console.log(dump(ast));
}

function transformRoot(node) {
  // 将逻辑编写在退出阶段的回调函数中，保证子节点全部被处理完毕
  return () => {
    // 如果不是根节点则什么都不做
    if (node.type !== 'Root') {
      return
    }
    // node是根节点，根节点的第一个子节点就是模板的根节点
    // 当然，这里我们暂时不考虑模板存在多个根节点的情况
    const vnodeJSAST = node.children[0].jsNode
    // 创建render函数的声明语句节点，将vnodeJSAST作为render函数体的返回语句
    node.jsNode = {
      type: 'FunctionDecl',
      id: {
        type: 'Identifier',
        name: 'render'
      },
      params: [],
      body: {
        type: 'ReturnStatement',
        return: vnodeJSAST
      }
    }
  }
}

const ast1 = parse(`<div><p>Vue</p><p>Template</p></div>`)
transform(ast1)

const FunctionDeclNode = {
  // 代表该节点是函数声明
  type: 'FunctionDecl',
  // 函数的名称是一个标识符，标识符本身也是一个节点
  id: {
    type: 'Identifier',
    // name用来存储标识符的名称，在这里它就是渲染函数的名称render
    name: 'render'
  },
  // 参数，目前渲染函数还不需要参数，
  params: [],
  // 渲染函数的函数体只有一个语句，即return语句
  body: [{
    type: 'ReturnStatement',
    return : {
      type: 'CallExpression',
      callee: {
        type: 'Identifier',
        name: 'h'
      },
      arguments: [{
        type: 'StringLiteral',
        value: 'div'
      }, {
        type: 'ArrayExpression',
        elements: [{
          type: 'CallExpression',
          callee: {
            type: 'Identifier',
            name: 'h'
          },
          arguments: [{
            type: 'StringLiteral',
            value: 'p'
          }, {
            type: 'StringLiteral',
            value: 'Vue'
          }]
        }, {
          type: 'CallExpression',
          callee: {
            type: 'Identifier',
            name: 'h'
          },
          arguments: [{
            type: 'StringLiteral',
            value: 'p'
          }, {
            type: 'StringLiteral',
            value: 'Template'
          }]
        }]
      }]
    }
  }]
}

function render() {
  // h函数的第一个参数是一个字符串字面量
  // h函数的第二个参数是一个数组
  return h('div', [])
}

function createStringLiteral(value) {
  return {
    type: 'StringLiteral',
    value
  }
}

function createIdentifier(name) {
  return {
    name: 'Identifier',
    name
  }
}

function createArrayExpression(elements) {
  return {
    type: 'ArrayExpression',
    elements
  }
}

function createCallExpression(callee, arguments) {
  return {
    type: 'CallExpression',
    callee: createIdentifier(callee),
    arguments
  }
}

function compile(template) {
  const ast = parse(template)
  transform(ast)
  const code = generate(ast.jsNode)
  return code
}

function generate(node) {
  const context = {
    // 存储最终生成的渲染函数代码
    code: '',
    push(code) {
      context.code += code
    },
    // 当前缩进的级别，初始值为0，即没有缩进
    currentIndent: 0,
    // 该函数用来换行，即在代码字符串的后面追加\n字符
    // 另外，换行时应该保留缩进，所以我们还要追加currentIndent * 2 个空格字符
    newline() {
      context.node += '\n' + '  '.repeat(context.currentIndent)
    },
    // 用来缩进，即让currentIndent自增后，调用换行函数
    indent() {
      context.currentIndent++
      context.newline()
    },
    // 取消缩进，即让currentIndent自减后，调用换行函数
    deIndent() {
      content.currentIndent--
      context.newline()
    }
  }
  // 调用genNode函数完成代码生成的工作
  genNode(node, context)

  // 返回渲染函数代码
  return context.code
}

function genNode(node, context) {
  switch(node.type) {
    case 'FunctionDecl':
      genFunctionDecl(node, context)
      break
    case 'ReturnStatement':
      genReturnStatement(node, context)
      break
    case 'CallExpression':
      genCallExpression(node, context)
      break
    case 'StringLiteral':
      genStringLiteral(node, context)
      break
    case 'ArrayExpression':
      genArrayExpression(node, context)
      break
  }
}

function genFunctionDecl(node, context) {
  // 从context对象中取出工具函数
  const { push, indent, deIndent } = context
  // node.id是一个标识符，用来描述函数的名称，即node.id.name
  push(`function ${node.id.name}`)
  push(`(`)
  // 调用genNodeList为函数的参数生成代码
  genNodeList(node.params, context)
  push(`)`)
  push(`{`)
  indent()
  node.body.forEach(n => genNode(n, context))
  deIndent()
  push(`}`)
}

function genNodeList(nodes, context) {
  const { push } = context
  for(let i = 0; i < nodes.length; i++) {
    const node = nodes[i]
    genNode(node, context)
    if (i < nodes.length - 1) {
      push(', ')
    }
  }
}

function genArrayExpression(node, context) {
  const { push } = context
  // 追加方括号
  push('[')
  // 调用genNodeList数组元素生成代码
  genNodeList(node.elements, context)
  // 补全方括号
  push(']')
}

function genReturnStatement(node, context) {
  const { push } = context
  // 追加return关键字和空格
  push('return ')
  // 调用genNode函数递归地生成返回值代码
  genNode(node.return, context)
}

function genStringLiteral(node, context) {
  const { push } = context
  // 对于字符串字面量，只需要追加与node.value对应的字符串即可
  push(`'${node.value}'`)
}

function genCallExpression(node, context) {
  const { push } = context
  // 取得被调用函数名称和参数列表
  const { callee, arguments: args } = node
  push(`${callee.name}(`)
  // 调用genNodeList生成参数代码
  genNodeList(args, context)
  // 补全括号
  push(`)`)
}