/**
 * Message type constants for Wickr messages
 */
export declare const MESSAGE_TYPE: {
  readonly TEXT: 1000;
  readonly KEY_VERIFICATION: 3000;
  readonly CREATE_ROOM: 4001;
  readonly MODIFY_ROOM_MEMBERS: 4002;
  readonly LEAVE_ROOM: 4003;
  readonly MODIFY_ROOM_PARAMS: 4004;
  readonly DELETE_ROOM: 4005;
  readonly DELETE_MESSAGE: 4011;
  readonly MESSAGE_ATTRIBUTES_MESSAGE: 4012;
  readonly MESSAGE_ATTRIBUTES_SYNC_REQUEST: 4013;
  readonly MODIFY_PRIVATE_PROPERTY: 4014;
  readonly ROOM_KEY_REQUEST: 4015;
  readonly ROOM_KEY_RESPONSE: 4016;
  readonly FILE: 6000;
  readonly CALL: 7000;
  readonly CALL_START: 7001;
  readonly CALL_END: 7002;
  readonly CALL_SYNC: 7003;
  readonly CALL_MISSED: 7004;
  readonly CALL_DECLINED: 7005;
  readonly LOCATION: 8000;
  readonly EDIT: 9000;
  readonly EDIT_REACTION: 9100;
};
