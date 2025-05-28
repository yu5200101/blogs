
// px需要带单位传 传入 '10px' 否则原样返回过去
export const px2rem = (px: string) => {
  if (!px.includes('px')) return px
  const size = px.slice(0, px.length - 2)
  return `${parseFloat(size) / 75}rem`
}