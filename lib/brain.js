class WickrBrain {
  constructor(wickr) {
    this.wickr = wickr
  }

  async get(key) {
    let value
    try {
      value = await this.wickr.cmdGetKeyValue(key)
    } catch (error) {
      console.log(`Error getting key ${key}:`, error)
      return null
    }

    return value
  }

  async set(key, value) {
    return await this.wickr.cmdAddKeyValue(key, value)
  }

  async delete(key) {
    return await this.wickr.cmdDeleteKeyValue(key)
  }

  async clear() {
    return await this.wickr.cmdClearAllKeyValues()
  }
}

module.exports = WickrBrain
