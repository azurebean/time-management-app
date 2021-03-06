export const localStorageMock: Storage = {
  store: {},
  key: () => '',
  length: 0,

  clear() {
    this.store = {}
  },

  getItem(key: string) {
    return this.store[key] || null
  },

  setItem(key: string, value: string) {
    this.store[key] = value.toString()
  },

  removeItem(key: string) {
    delete this.store[key]
  },
}
