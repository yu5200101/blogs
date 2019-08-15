

let m = [1, 2, 3, 4, 5]
let n = [2, 4, 6, 7]
let mSet = new Set(m)
let nSet = new Set(n)

// 并集
let union = Array.from(new Set(m.concat(n))) // [1,2,3,4,5,6,7]
console.log(union)

// 交集
let intersection = Array.from(new Set(m.filter(v => nSet.has(v)))// [2, 4]
)
console.log(intersection)

// 差集
let differenceNew = Array.from(new Set(m.concat(n).filter(v => mSet.has(v) && !nSet.has(v)))//[1, 3, 5]
)
console.log(differenceNew)



let a = [{
  prop: 'time', 
  label: '时间' 
}, {
  prop: 'hour',
  label: '小时'
}, {
  prop: 'minute', 
  label: '分钟' 
}, {
  prop: 'second', 
  label: '秒数' 
}, {
  prop: 'year',
  label: '年'
}]
let b = [
  {
    prop: 'month',
    label: '月'
  },
  {
    prop: 'date',
    label: '日期'
  },
  {
    prop: 'day', 
    label: '日'
  },
  {
    prop: 'ms',
    label: '毫秒'
  },
  {
    prop: 'minute',
    label: '分钟'
  },
  {
    prop: 'year',
    label: '年'
  }
]
// 取并集
const union1 = b.filter(item => !a.find(it => it.prop === item.prop))
console.log(union1);

console.log('并集', [...a, ...union1]);

// 取交集
const intersection1 = a.filter(item => b.find(it => it.prop === item.prop))
console.log('交集', intersection1);

// 取a1中没有b1值得数组
const differenceNew1 = a.filter(x => !b.find(y => y.prop === x.prop)); 
console.log('差集', differenceNew1);








