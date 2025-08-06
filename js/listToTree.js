// 列表转树，时间复杂度O(n)
let list = [
{ id: 1, title: "child1", parentId: 0 },
{ id: 2, title: "child2", parentId: 0 },
{ id: 3, title: "child3", parentId: 0 },
{ id: 4, title: "child1_1", parentId: 1 },
{ id: 5, title: "child1_2", parentId: 1 },
{ id: 6, title: "child2_1", parentId: 2 },
{ id: 7, title: "child3_1", parentId: 3 }
];
console.log(listToTree(list));

function listToTree(ary) {
  const map = new Map()
  for(let i = 0; i < ary.length; i++) {
    const list = map.get(ary[i].parentId) || []
    map.set(ary[i].parentId, [...list, ary[i]])
  }
  const result = []
  for(let i = 0; i < ary.length; i++) {
    const cur = ary[i]
    const childList = map.get(cur.id) || []
    if (childList.length) {
      cur.children = childList
      result.push(cur)
    }
  }
  return result
}