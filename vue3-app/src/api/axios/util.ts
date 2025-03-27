/* eslint-disable max-statements */
export const random16Hex = () => (0x10000 | Math.random() * 0x10000).toString(16).substr(1)
export const random64Hex = () => random16Hex() + random16Hex() + random16Hex() + random16Hex()

const b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
export const stringToBase64 = (str: string) => {
  str = String(str)
  let bitmap = undefined
  let variableA = undefined
  let variableB = undefined
  let variableC = undefined
  let result = ''
  let index = 0
  const len = str.length
  const rest = len % 3
  for (; index < len;) {
    if (
      (variableA = str.charCodeAt(index++)) > 255 ||
      (variableB = str.charCodeAt(index++)) > 255 ||
      (variableC = str.charCodeAt(index++)) > 255
    ) {
      throw new TypeError('Failed to execute \'btoa\' on \'Window\': The string to be encoded contains characters outside of the Latin1 range.')
    }

    bitmap = variableA << 16 | variableB << 8 | variableC

    result +=
      b64.charAt(bitmap >> 18 & 63) +
      b64.charAt(bitmap >> 12 & 63) +
      b64.charAt(bitmap >> 6 & 63) +
      b64.charAt(bitmap & 63)
  }

  return rest ? result.slice(0, rest - 3) + '==='.substring(rest) : result
}