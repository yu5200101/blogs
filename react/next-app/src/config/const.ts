// 任意对象
export interface MapInfo {
  [propName: string]: any;
}
export type NumAry = Array<number>
// 单个数字
interface ItemInfo {
  readonly label: string
  readonly value: string | number
  readonly [propName: string]: any
}
/**
 * @description: 将数组转成对象
 * @param {*} arr
 * @return {*} object
 */
const transformToMap = function(arr: ItemInfo[]): MapInfo {
  const obj:MapInfo = {}

  arr.forEach(item => {
    obj[item.value] = item.label
  })

  return obj
}

// 原始配置
export const coolMan:ItemInfo[] = [
  { label: '白敬亭', value: 1 },
  { label: '李现', value: 2 }
]

// key,val形势
export const coolManObj = transformToMap(coolMan)
