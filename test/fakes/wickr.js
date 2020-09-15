class FakeWickr {
    clientInit() {}
    cmdAddKeyValue() {}
    cmdClearAllKeyValues() {}
    cmdDeleteKeyValue() {}
    cmdGetKeyValue() {
        throw new Error('key not found');
    }
    cmdGetRooms() {}
    cmdStartAsyncRecvMessages() {}
    cmdSendRoomMessage() {}
    cmdSend1to1Message() {}
    isConnected() {}
}

module.exports = FakeWickr;
