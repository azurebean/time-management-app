export const storage = {
  save: (item: any, name: string) => {
    if (item == null || item == undefined) {
      localStorage.removeItem(name)
      return
    }
    const itemStr = JSON.stringify(item)
    localStorage.setItem(name, itemStr)
  },
  load: (name: string) => {
    try {
      return JSON.parse(localStorage.getItem(name))
    } catch (error) {
      return
    }
  },
  clear: (name: string) => {
    localStorage.removeItem(name)
  },
}
