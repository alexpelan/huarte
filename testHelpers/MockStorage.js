/* eslint-disable */
// https://stackoverflow.com/a/40957570
export default class MockStorage {
  constructor(cache = {}) {
    this.storageCache = cache;
  }

  setItem = jest.fn((key, value) => new Promise((resolve, reject) => ((typeof key !== 'string' || typeof value !== 'string')
    ? reject(new Error('key and value must be string'))
    : resolve(this.storageCache[key] = value))));

  getItem = jest.fn(key => new Promise(resolve => (Object.prototype.hasOwnProperty.call(this.storageCache, key)
    ? resolve(this.storageCache[key])
    : resolve(null))));

  getMultiItem = jest.fn(key => new Promise(resolve => (Object.prototype.hasOwnProperty.call(this.storageCache, key)
    ? resolve([key, this.storageCache[key]])
    : resolve([key, null]))));

  removeItem = jest.fn(key => new Promise((resolve, reject) => (Object.prototype.hasOwnProperty.call(this.storageCache, key)
    ? resolve(delete this.storageCache[key])
    : reject('No such key!'))));

  clear = jest.fn(() => new Promise(resolve => resolve(this.storageCache = {})));

  getAllKeys = jest.fn(() => new Promise(resolve => resolve(Object.keys(this.storageCache))));

  multiGet = jest.fn(keys => Promise.all(keys.map(key => this.getMultiItem(key))));
}
