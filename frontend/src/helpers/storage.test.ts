import { storage } from './storage'
import { localStorageMock } from './__mocks__/localStorageMock'

global.localStorage = localStorageMock

const itemName = 'test_item_name'
const itemValue = {
  key1: 'value1',
  key2: 'value2',
}

it('should save item to localStorage', () => {
  localStorage.removeItem(itemName)
  storage.save(itemValue, itemName)
  const value = JSON.parse(localStorage.getItem(itemName))
  expect(value).toEqual(itemValue)
})

it('should load item from localStorage', () => {
  localStorage.removeItem(itemName)
  localStorage.setItem(itemName, JSON.stringify(itemValue))
  expect(storage.load(itemName)).toEqual(itemValue)
})

it('should clear item from localStorage', () => {
  localStorage.setItem(itemName, JSON.stringify(itemValue))
  storage.clear(itemName)
  expect(JSON.parse(localStorage.getItem(itemName))).toBe(null)
})
