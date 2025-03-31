const graph = {
  'A': ['B', 'C'],
  'B': ['A', 'D', 'E'],
  'C': ['A', 'F'],
  'D': ['B'],
  'E': ['B', 'F'],
  'F': ['C', 'E']
}

// 深度优先遍历
const dfs = (graph, node) => {
  const visitedMap = new Map()
  visitedMap.set(node, true)
  const res = []
  const stack = [node]
  while(stack.length) {
    const curNode = stack.pop()
    res.push(curNode)
    for(let i = graph[curNode].length - 1; i >= 0; i--) {
      const loopNode = graph[curNode][i]
      if (!visitedMap.get(loopNode)) {
        visitedMap.set(loopNode, true)
        stack.push(graph[curNode][i])
      }
    }
  }
  return res
}

// 广度优先遍历
const bfs = (graph, node)=> {
  const visitedMap = new Map()
  visitedMap.set(node, true)
  const res = []
  const queue = [node]
  while(queue.length) {
    const curNode = queue.shift()
    res.push(curNode)
    graph[curNode].forEach(loopNode => {
      if (!visitedMap.get(loopNode)) {
        visitedMap.set(loopNode, true)
        queue.push(loopNode)
      }
    })
  }
  return res
}

console.log('dfs', dfs(graph, 'A'))
console.log('bfs', bfs(graph, 'A'))