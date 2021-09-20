/**
 * @param {number[]} nums
 */
var Solution = function (nums) {
  this.nums = nums
  this.original = this.nums.slice()
};

/**
 * @return {number[]}
 */
Solution.prototype.reset = function () {
  this.nums = this.original.slice()
  return this.nums
};

/**
 * @return {number[]}
 */
Solution.prototype.shuffle = function () {
  const shuffleList = []
  const list = this.nums.map(item => item)
  for (let i = 0; i < this.nums.length; i++) {
    let j = Math.floor(Math.random() * list.length)
    shuffleList[i] = list.splice(j, 1)
  }
  this.nums = shuffleList.slice()
  return this.nums
};

/**
 * Your Solution object will be instantiated and called as such:
 * var obj = new Solution(nums)
 * var param_1 = obj.reset()
 * var param_2 = obj.shuffle()
 */