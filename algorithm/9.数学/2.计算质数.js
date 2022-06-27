/**
 * @param {number} n
 * @return {number}
 */
const isPrime = (x) => {
  for (let i = 2; i * i <= x; i++) {
    if (x % i === 0) {
      return false
    }
  }
  return true
}
var countPrimes = function (n) {
  let total = 0
  for (let i = 2; i < n; i++) {
    total += isPrime(i)
  }
  return total
};