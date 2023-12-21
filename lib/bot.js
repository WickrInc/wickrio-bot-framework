const fs = require('fs')
const EventEmitter = require('events')
const mergician = require('mergician')

const WickrBrain = require('./brain')
const { MESSAGE_TYPE } = require('./constants')

class WickrBot extends EventEmitter {
  constructor(wickr, username) {
    super()
    this.wickr = wickr
    this.brain = new WickrBrain(wickr)
    this.handlers = {
      'help': {fn: this.sendHelp.bind(this) },
    }
    this.defaultHandler = undefined
    this.fileHandler = undefined

    this.username = username || this._getUsername()
    this.on('start', () => this.wickr.cmdStartAsyncRecvMessages(this.handleMessage()))
  }

  async start() {
    this.wickr.clientInit(this.username)
    await this.waitForState('RUNNING')
    this.emit('start')
  }

  /**
   * _parseMessage reads an incoming message and parses out the command and arguments.
   * The command is whatever word immediately follows a forward-slash at the beginning of
   * the message, and the arguments are all of the words that follow.
   *
   * If the message is not in slash-command format, the args are returned with no command.
   * @param {string} message
   * @returns {command, args}
   */
  _parseMessage(message) {
    let regex = /^\/([\w\d]+)(?:@[^\s]+)?\s*(.*)?/
    let match = message.match(regex)
    let splitArgs = (s) => s.trim().split(/\s+/)

    if (match === null) {
      return { command: undefined, args: splitArgs(message)}
    }

    let command = match[1]
    let args = []
    // set the args to everything after the /command in the message (if available)
    if (match[2] != null) {
      args = splitArgs(match[2])
    }

    return {command: command, args: args}
  }

  _getUsername() {
    let username = process.argv[2]
    if (username == null) {
      throw new Error('Username not found. Pass it as the first argument to the start.sh script or in the WickrBot constructor')
    }
    return username
  }

  sendHelp(msg) {
    let response = ''

    if (this.helpText) {
      response = this.helpText + '\n\n'
    }

    response += 'Available commands:\n'

    for (let [handler, value] of Object.entries(this.handlers)) {
      if (handler == 'help' || value.hidden === true) {
        continue
      }
      if (value.description) {
        response += ` - ${handler}: ${value.description}\n`
      } else {
        response += ` - ${handler}\n`
      }
    }

    this.send(msg.vgroupid, response.trim())
  }

  handleMessage() {
    // return as an arrow function to maintain `this` binding
    return (message) => {
      const data = JSON.parse(message)

      let handler = this.defaultHandler
      let handlerName = 'default'
      let args

      if (data.msgtype === MESSAGE_TYPE.FILE && this.fileHandler) {
        handler = this.fileHandler
        handlerName = 'file'
      } else if (data.msgtype === MESSAGE_TYPE.TEXT) {
        const msg = this._parseMessage(data.message)
        // text type messages receive an array of the words of the message as the second argument
        args = msg.args

        // A slash command exists for this message, call its handler instead of the default handler
        if (msg.command in this.handlers) {
          handler = this.handlers[msg.command].fn
          handlerName = msg.command
        }
      }

      if (handler) {
        try {
          handler(data, args)
        } catch (error) {
          console.warn(`Error executing ${handlerName} handler:`, error)
        }
      }
    }
  }

  createGroupConvo(users) {
    if (typeof users === 'string') {
      users = [users]
    }
    return this.wickr.cmdAddGroupConvo(users)
  }

  deleteGroupConvo(vgroupid) {
    return this.wickr.cmdDeleteGroupConvo(vgroupid)
  }

  createRoom(users, moderators, title, description) {
    if (typeof users === 'string') {
      users = [users]
    }
    if (typeof moderators === 'string') {
      moderators = [moderators]
    }
    return this.wickr.cmdAddRoom(users, moderators, title, description || '')
  }

  leaveRoom(vgroupid) {
    return this.wickr.cmdLeaveRoom(vgroupid)
  }

  deleteRoom(vgroupid) {
    return this.wickr.cmdDeleteRoom(vgroupid)
  }

  /**
     * modifyRoom will set the state of the room
     * This requires that you send the whole state of the room in your update, you may want to use `updateRoom` instead.
     *
     * @param {string} vgroupid
     * @param {string|array} users
     * @param {string|array} moderators
     * @param {string} title
     * @param {string} description
     * @returns boolean
     */
  modifyRoom(vgroupid, users, moderators, title, description) {
    if (typeof users === 'string') {
      users = [users]
    }
    if (typeof moderators === 'string') {
      moderators = [moderators]
    }
    return this.wickr.cmdModifyRoom(vgroupid, users, moderators, title, description)
  }

  /**
     * updateRoom sets the state of a room by performing a `getRoom` request, merging in the supplied settings,
     * and then calling `modifyRoom`.
     *
     * @param {string} vgroupid
     * @param {object} settings
     * @returns boolean
     */
  updateRoom(vgroupid, settings) {
    const roomState = this.getRoom(vgroupid)

    if (!roomState) return false

    // format room state so that we can turn it into arguments for modifyRoom
    const formattedRoomState = this._formatRoomStateForUpdate(roomState)
    const { members, moderators, title, description } = mergician({
      appendArrays: true,
      dedupArrays: true,
    })(formattedRoomState, settings)

    return this.modifyRoom(vgroupid, members, moderators, title, description)
  }

  /**
     * _formatRoomStateForUpdate accepts a getRoom response and formats it into a response usable with `updateRoom`
     * @param {object} state
     */
  _formatRoomStateForUpdate(state) {
    const getName = (m) => m.name
    state.moderators = state.masters.map(getName)
    state.members = state.members.map(getName)
    delete(state.masters)
    return state
  }

  getGroupConvos() {
    return JSON.parse(this.wickr.cmdGetGroupConvos())
  }

  getGroupConvoIDs() {
    let convos = this.getGroupConvos().groupconvos || []
    return convos.map(c => c.vgroupid)
  }

  getRoom(vgroupid) {
    return JSON.parse(this.wickr.cmdGetRoom(vgroupid))
  }

  getRooms() {
    return JSON.parse(this.wickr.cmdGetRooms())
  }

  getRoomIDs() {
    let rooms = this.getRooms().rooms || []
    return rooms.map(r => r.vgroupid)
  }

  getUsers() {
    return this.wickr.getUsers()
  }

  getStats() {
    return JSON.parse(this.wickr.cmdGetStatistics()).statistics
  }

  clearStats() {
    return this.wickr.cmdClearStatistics()
  }

  isConnected(timeout=10) {
    return this.wickr.isConnected(timeout)
  }

  /**
   * send is an alias for the sendMessage method
   */
  send(room, content, properties) {
    // not sure if there's a better way to alias this function
    return this.sendMessage(room, content, properties)
  }

  /**
   * sendToUser calls the cmdSend1to1Message API to send a message to a user
   *
   * @param {string, array} user The username or usernames to send the 1:1 message to
   * @param {string} content The message body
   * @param {object} properties Additional values to send with the message
   * @returns void
   */
  sendToUser(user, content, properties) {
    if (typeof user === 'string') {
      user = [user]
    }

    try {
      return this.wickr.cmdSend1to1Message(user, content, '', '', '', [], JSON.stringify(properties?.meta) || '')
    } catch (error) {
      console.error('Error sending 1:1 message:', error)
    }
  }

  /**
   * sendMessage calls the cmdSendRoomMessage API to send a message to a room
   *
   * @param {string} room The vgroupid of the room
   * @param {string} content The message body
   * @param {object} properties Additional values to send with the message
   * @returns void
   */
  sendMessage(room, content, properties) {
    try {
      return this.wickr.cmdSendRoomMessage(room, content, '', '', '', [], JSON.stringify(properties?.meta) || '')
    } catch (error) {
      console.error('Error sending group message:', error)
    }
  }

  sendAttachment(room, attachment, displayName) {
    try {
      return this.wickr.cmdSendRoomAttachment(room, attachment, displayName)
    } catch (error) {
      console.error('Error sending attachment:', error)
    }
  }

  listen(command, callback, opts) {
    this.handlers[command] = {
      fn: callback,
      ...opts,
    }
  }

  /**
   * setDefaultHandler defines the function which will be called when a message of any type is received
   * which does not match any slash command
   *
   * @param {function (msg, args)} fn The function to call
   */
  setDefaultHandler(fn) {
    this.defaultHandler = fn
  }

  /**
   * setFileHandler defines the function which will be called when a file is received
   *
   * See https://wickrinc.github.io/wickrio-docs/#definitions-wickr-message-formats-file-transfer-messages
   * for the complete format of a file transfer message
   *
   * @param {function (msg)} fn The function to call when a file is received
   */
  setFileHandler(fn) {
    this.fileHandler = fn
  }

  /**
   * setAvatar sets the user icon for the bot in Wickr
   *
   * @param {string} imgPath path to an image file containing the avatar
   * @returns {boolean} `true` when the operation succeeded, `false` otherwise
   */
  setAvatar(imgPath) {
    if (!fs.existsSync(imgPath)) throw new Error(`Unable to set avatar. File ${imgPath} not found.`)

    return this.wickr.cmdSetAvatar(imgPath)
  }

  async waitForState(state, retries=10, interval=1000, exponential=true) {
    const curState = this.wickr.getClientState()

    if (curState === state) return
    else if (retries) {
      console.log(`Waiting for state to be ${state}, currently ${curState}. Retries left: ${retries}`)
      await new Promise(r => setTimeout(r, interval))
      await this.waitForState(state, retries - 1, exponential ? interval * 2 : interval, exponential)
    } else throw new Error('Max retries reached waiting for state')
  }
}

module.exports = WickrBot
module.exports.MESSAGE_TYPE = MESSAGE_TYPE
