/**
 * Interface for the Wickr API client
 * This should be defined in the API itself but we're making one here.
 * This isn't a complete interface
 */
export interface WickrAPI {
  clientInit(clientName: string);
  isConnected(timeout: number);
  getClientState(): string;
  cmdGetKeyValue(key: string): string;
  cmdAddKeyValue(key: string, value: string): boolean;
  cmdDeleteKeyValue(key: string): boolean;
  cmdClearAllKeyValues(): boolean;
  cmdStartAsyncRecvMessages(callback: (msg: any) => void);
  cmdAddGroupConvo(users: string[]);
  cmdModifyRoom(vgroupid: string, users: string[], moderators: string[], title: string, description: string);
  cmdDeleteGroupConvo(vgroupid: string);
  cmdLeaveRoom(vgroupid: string);
  cmdDeleteRoom(vgroupid: string);
  cmdGetGroupConvos(): string;
  cmdGetRooms(): string;
  cmdGetStatistics(): string;
  cmdClearStatistics(): void;
}