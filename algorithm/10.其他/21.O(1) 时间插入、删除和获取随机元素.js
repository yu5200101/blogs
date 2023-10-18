/*
实现RandomizedSet 类：

RandomizedSet() 初始化 RandomizedSet 对象
bool insert(int val) 当元素 val 不存在时，向集合中插入该项，并返回 true ；否则，返回 false 。
bool remove(int val) 当元素 val 存在时，从集合中移除该项，并返回 true ；否则，返回 false 。
int getRandom() 随机返回现有集合中的一项（测试用例保证调用此方法时集合中至少存在一个元素）。每个元素应该有 相同的概率 被返回。
你必须实现类的所有函数，并满足每个函数的 平均 时间复杂度为 O(1) 。
*/

var RandomizedSet = function() {
  this.ary = []
  this.map = new Map()
};

/**
* @param {number} val
* @return {boolean}
*/
RandomizedSet.prototype.insert = function(val) {
  if (this.map.has(val)) return false
  this.ary.push(val)
  this.map.set(val, this.ary.length - 1)
  return true
};

/**
* @param {number} val
* @return {boolean}
*/
RandomizedSet.prototype.remove = function(val) {
  if (!this.map.has(val)) return false
  const index = this.map.get(val)
  this.ary[index] = this.ary[this.ary.length - 1]
  this.map.set(this.ary[index], index)
  this.ary.pop()
  this.map.delete(val)
  return true
};

/**
* @return {number}
*/
RandomizedSet.prototype.getRandom = function() {
  const randomIndex = Math.floor(Math.random() * this.ary.length)
  return this.ary[randomIndex]
};

/**
* Your RandomizedSet object will be instantiated and called as such:
* var obj = new RandomizedSet()
* var param_1 = obj.insert(val)
* var param_2 = obj.remove(val)
* var param_3 = obj.getRandom()
*/