class HashTable {
  constructor(m) {
    this.upper = 10
    this.lower = 2
    this.capacityList = [53, 97, 193, 389, 769, 1543, 3079, 6151, 12289, 24593]
    this.capacityIndex = 0
    this.m = this.capacityList[this.capacityIndex]
    this.size = 0
    this.hashTable = new Array(m)
    for(let i = 0; i < m; i++) {
      this.hashTable[i] = new Map()
    }
  }
  getSize() {
    return this.size
  }
  add(key, value) {
    const tempMap = this.hashTable[key]
    if (tempMap.get(value)) {
      tempMap.set(value, key)
    } else {
      tempMap.set(value, key)
      this.size++
      if (this.size >= this.upper * this.m && this.capacityIndex + 1 < this.capacityList.length) {
        this.capacityIndex++
        this.resize(this.capacityList[this.capacityIndex])
      }
    }
  }
  remove(key, value) {
    const tempMap = this.hashTable[key]
    let ret = null
    if (tempMap.get(value)) {
      ret = tempMap.remove(value)
      this.size--
      if (this.size < this.lower * this.m && this.capacityIndex - 1 > -1) {
        this.capacityIndex--
        this.resize(this.capacityList[this.capacityIndex])
      }
    }
    return ret
  }
  set(key, value) {
    const tempMap = this.hashTable[key]
    if (!tempMap.get(value)) {
      return new Error('not exist!')
    }
    tempMap.set(value, key)
  }
  has(key, value) {
    return this.hashTable[key].get(value)
  }
  resize(size) {
    this.newHashTable = new Array(size)
    for(let i = 0; i < size; i++) {
      this.newHashTable[i] = new Map()
    }
    const oldM = this.m
    this.m = size
    for(let i = 0; i < oldM; i++) {
      const tempMap = this.hashTable[i]
      this.newHashTable[i].set()
    }
    this.hashTable = this.newHashTable
  }
}