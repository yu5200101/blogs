function cal(ary) {
  if (ary.length === 0) return 0
  let result = ary[0]
  let min = ary[0]
  let max = ary[0]
  for (let i = 1; i < ary.length; i++) {
    if (ary[i] < 0) {
      [min, max] = [max, min]
    }
    max = Math.max(ary[i], ary[i] * max)
    min = Math.min(ary[i], ary[i] * min)
    result = Math.max(max, result)
  }
  return result
}