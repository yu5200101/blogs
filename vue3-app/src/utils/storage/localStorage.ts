const LocalStorageUtil = {
  removeItem(key: string): boolean {
    try {
      window.localStorage.removeItem(key)
      return true
    } catch (error) {
      return false
    }
  },

  clear(): boolean {
    try {
      window.localStorage.clear()
      return true
    } catch (error) {
      return false
    }
  },
  setItem(key: string, value: any): boolean {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
      return true
    } catch (error) {
      return false
    }
  },

  getItem(key: string): any {
    try {
      const value = window.localStorage.getItem(key)
      return value ? JSON.parse(value) : null
    } catch (error) {
      return null
    }
  },

  appendItem(key: string, value: any): boolean {
    try {
      const item = this.getItem(key)
      const newItem = { ...item, ...value }
      this.setItem(key, newItem)
      return true
    } catch (error) {
      return false
    }
  }
}

export default LocalStorageUtil
