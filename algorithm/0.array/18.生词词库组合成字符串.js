function cartesianProduct(arrays) {
  return arrays.reduce((total, cur) => {
    return total.flatMap(arr => cur.map(item => [...arr, item]))
  }, [[]])
}

function generateWord(lib1, lib2, lib3, rule) {
  const arr = rule.map(key => {
    switch (key) {
      case 1: return lib1;
      case 2: return lib2;
      case 3: return lib3;
      default: throw new Error(`Invalid rule number: ${key}`);
    }
  })
  const lastArr = cartesianProduct(arr)
  return lastArr.map(item => item.join('  '))
}

// 示例用法：
const lib1 = ['发布', '推出'];
const lib2 = ['小度音箱', '小度在家'];
const lib3 = ['2028 新款', '2019 再版'];
const rule = [2, 3, 1]; // 代表第二个词库 + 第三个词库 + 第一个词库

const result = generateWord(lib1, lib2, lib3, rule);
console.log(result);