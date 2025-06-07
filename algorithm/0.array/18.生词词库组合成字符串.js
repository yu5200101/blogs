// 示例用法：
const lib1 = ['发布', '推出'];
const lib2 = ['小度音箱', '小度在家'];
const lib3 = ['2028 新款', '2019 再版'];
const rule = [2, 3, 1]; // 代表第二个词库 + 第三个词库 + 第一个词库

const result = []
const help = (count, path, arr) => {
  if (path.length === arr.length) {
    result.push(path.join(' '))
    return
  }
  for(let i = 0; i < arr[count].length; i++) {
    const cur = arr[count][i]
    help(count + 1, [...path, cur], arr)
  }
}

const arr = rule.map(key => {
  switch (key) {
    case 1: return lib1;
    case 2: return lib2;
    case 3: return lib3;
    default: throw new Error(`Invalid rule number: ${key}`);
  }
})
help(0, [], arr)
console.log(result)
