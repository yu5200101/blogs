/**
 * @param {number} num
 * @return {string}
 */
var intToRoman = function (num) {
  let one = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX']
  let tow = ['', 'X', 'XX', 'XXX', 'XL', 'L', 'LX', 'LXX', 'LXXX', 'XC']
  let three = ['', 'C', 'CC', 'CCC', 'CD', 'D', 'DC', 'DCC', 'DCCC', 'CM']
  let four = ['', 'M', 'MM', 'MMM']
  return four[Math.floor(num / 1000)] + three[Math.floor(num % 1000 / 100)] + tow[Math.floor(num % 100 / 10)] + one[num % 10]
};

/**
 * @param {number} num
 * @return {string}
 */
var intToRoman2 = function (num) {
  let nums = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1]
  let str = ["M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"]
  let res = ''
  for (let i = 0; i < nums.length; i++) {
    while (num >= nums[i]) {
      res += str[i]
      num -= nums[i]
    }
  }
  return res
};