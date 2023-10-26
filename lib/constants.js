const MESSAGE_TYPE = {
  TEXT: 1000,
  KEY_VERIFICATION: 3000,
  CREATE_ROOM: 4001,
  MODIFY_ROOM_MEMBERS: 4002,
  LEAVE_ROOM: 4003,
  MODIFY_ROOM_PARAMS: 4004,
  DELETE_ROOM: 4005,
  DELETE_MESSAGE: 4011,
  MESSAGE_ATTRIBUTES_MESSAGE: 4012,
  MESSAGE_ATTRIBUTES_SYNC_REQUEST: 4013,
  MODIFY_PRIVATE_PROPERTY: 4014,
  ROOM_KEY_REQUEST: 4015,
  ROOM_KEY_RESPONSE: 4016,
  FILE: 6000,
  CALL: 7000,
  CALL_START: 7001,
  CALL_END: 7002,
  CALL_SYNC: 7003,
  CALL_MISSED: 7004,
  CALL_DECLINED: 7005,
  LOCATION: 8000,
  EDIT: 9000,
  EDIT_REACTION: 9100,
}

module.exports = { MESSAGE_TYPE }