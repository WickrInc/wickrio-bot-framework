const EventEmitter = require('events');

const WickrBrain = require('./brain');

const MESSAGE_TYPE = {
  TEXT: 1000,
  VERIFICATION: 3000,
  CREATE_ROOM: 4001,
  MODIFY_ROOM_MEMBERS: 4002,
  LEAVE_ROOM: 4003,
  MODIFY_ROOM_PARAMS: 4004,
  DELETE_ROOM: 4005,
  DELETE_MESSAGE: 4009,
  FILE: 6000,
  CALL: 7000
}

class WickrBot extends EventEmitter {
    constructor(wickr, username) {
        super();
        this.wickr = wickr;
        this.brain = new WickrBrain(wickr);
        this.handlers = {
            'help': {fn: this.sendHelp.bind(this) }
        };

        this.username = username || this._getUsername();
        this.on('start', () => this.wickr.cmdStartAsyncRecvMessages(this.handleMessage()));
    }

    async start() {
        this.wickr.clientInit(this.username);
        await this.waitForState("RUNNING");
        this.emit('start');
    }

    _parseMessage(message) {
        let regex = /^\/([\w\d]+)(?:@[^\s]+)?\s*(.*)?/;
        let match = message.match(regex);
        if (match == null) {
            return null;
        }

        let command = match[1];
        let args = [];
        // set the args to everything after the /command in the message (if available)
        if (match[2] != null) {
            args = match[2].trim().split(/\s+/);
        }

        return {command: command, args: args}
    }

    _getUsername() {
        let username = process.argv[2];
        if (username == null) {
            throw new Error('Username not found. Pass it as the first argument to the start.sh script or in the WickrBot constructor');
        }
        return username;
    }

    sendHelp(msg) {
        let response = "";

        if (this.helpText) {
            response = this.helpText + "\n\n";
        }

        response += "Available commands:\n"

        for (let [handler, value] of Object.entries(this.handlers)) {
            if (handler == "help") {
                continue;
            }
            if (value.description) {
                response += ` - ${handler}: ${value.description}\n`;
            } else {
                response += ` - ${handler}\n`;
            }
        }

        this.send(msg.vgroupid, response.trim());
    }

    handleMessage() {
        // return as an arrow function to maintain `this` binding
        return (message) => {
            //console.log("Message received:", message);
            let data = JSON.parse(message);
            if (data.msgtype !== MESSAGE_TYPE.TEXT) {
                return;
            }

            let msg = this._parseMessage(data.message);

            if (msg && msg.command in this.handlers) {
                try {
                    this.handlers[msg.command].fn(data, msg.args);
                } catch (error) {
                    console.error(`Error executing '${msg.command}' handler:`, error);
                }
            }
        }
    }

    createGroupConvo(users) {
        if (typeof users === "string") {
            users = [users];
        }
        return this.wickr.cmdAddGroupConvo(users);
    }

    getGroupConvos() {
        return JSON.parse(this.wickr.cmdGetGroupConvos());
    }

    getGroupConvoIDs() {
        let convos = this.getGroupConvos().groupconvos || [];
        return convos.map(c => c.vgroupid);
    }

    getRooms() {
        return JSON.parse(this.wickr.cmdGetRooms());
    }

    getRoomIDs() {
        let rooms = this.getRooms().rooms || [];
        return rooms.map(r => r.vgroupid);
    }

    getUsers() {
        return this.wickr.getUsers();
    }

    getStats() {
        return JSON.parse(this.wickr.cmdGetStatistics()).statistics;
    }

    clearStats() {
        return this.wickr.cmdClearStatistics();
    }

    isConnected(timeout=10) {
        return this.wickr.isConnected(timeout);
    }

    send(room, content) {
        // not sure if there's a better way to alias this function
        return this.sendMessage(room, content)
    }

    sendToUser(user, content) {
        if (typeof user === "string") {
            user = [user];
        }
        return this.wickr.cmdSend1to1Message(user, content);
    }

    sendMessage(room, content) {
        try {
            return this.wickr.cmdSendRoomMessage(room, content);
        } catch (error) {
            console.error(`Error sending message:`, error);
        }
    }

    sendAttachment(room, attachment, displayName) {
        try {
            return this.wickr.cmdSendRoomAttachment(room, attachment, displayName);
        } catch (error) {
            console.error(`Error sending attachment:`, error);
        }
    }

    listen(command, callback, opts) {
        this.handlers[command] = {
            fn: callback,
            ...opts
        }
    }

    async waitForState(state, retries=10, interval=1000, exponential=true) {
        const curState = this.wickr.getClientState();

        if (curState === state) return;
        else if (retries) {
            console.log(`Waiting for state to be ${state}, currently ${curState}. Retries left: ${retries}`);
            await new Promise(r => setTimeout(r, interval));
            await this.waitForState(state, retries - 1, exponential ? interval * 2 : interval, exponential);
        } else throw new Error('Max retries reached waiting for state');
    }
}

module.exports = WickrBot;
