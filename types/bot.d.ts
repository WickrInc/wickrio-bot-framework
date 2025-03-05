import { EventEmitter } from 'events';
import { WickrBrain } from './brain';
import { WickrAPI } from './api';
import { MESSAGE_TYPE } from './constants';

/**
 * Interface for a message received from Wickr
 */
export interface WickrMessage {
  /**
   * The type of message
   */
  msgtype: number;
  
  /**
   * The message content (for text messages)
   */
  message?: string;
  
  /**
   * The virtual group ID (room or conversation ID)
   */
  vgroupid: string;

  /**
   * Unique identifier for the message
   */
  message_id: string

  /**
   * Indicates if the message is a part of a room (true) or a direct message (false)
   */
  is_room: boolean

  /**
   * Wickr ID of the user who sent the message
   */
  sender: string

  /**
   * Indicates if the message was sent from a guest user or a normal user
   */
  sender_type: 'guest' | 'normal'

  /**
   * Wickr ID of the receiver, for 1-to-1 messages.
   */
  receiver?: string

  /**
   * The time the message was sent with microsecond accuracy (e.g. "1510777143.738976")
   */
  msg_ts: string

  /**
   * Displayable time message was sent.
   */
  time: string

  /**
   * The time the message was sent in ISO format (YYYY-MM-DD hh:mm:ss.xxx)
   */
  time_iso: string

  /**
   * For file message types, this contains details about the file
   */
  file?: FileAttachment
}

export interface FileAttachment {
  /**
   * The display name of the file being transferred, e.g. "clipboard.png"
   */
  filename: string

  /**
   * A unique identifier for the transferred file
   */
  guid: string

  /**
   * The full path name of the file on the bot's local filesystem.
   */
  localfilename: string

  /**
   * The uploading user
   */
  uploadedbyuser: string

  /**
   * The time the file was uploaded
   */
  uploadedtimestamp: string
}

/**
 * Interface for parsed message components
 */
export interface ParsedMessage {
  /**
   * The command extracted from the message (if any)
   */
  command?: string;
  
  /**
   * The arguments extracted from the message. It is an array of words from the message split on spaces.
   * This is all of the text provided after the "command" portion of the message, or the entire message if
   * a command isn't provided.
   */
  args: string[];
}

/**
 * Interface for handler options
 */
export interface HandlerOptions {
  /**
   * Description of the command for help text
   */
  description?: string;
  
  /**
   * Whether to hide the command from help text
   */
  hidden?: boolean;
  
  /**
   * Additional options
   */
  [key: string]: any;
}

/**
 * Interface for handler registry
 */
export interface HandlerRegistry {
  [command: string]: {
    /**
     * The handler function
     */
    fn: MessageHandler;
    
    /**
     * Description of the command for help text
     */
    description?: string;
    
    /**
     * Whether to hide the command from help text
     */
    hidden?: boolean;
    
    /**
     * Additional options
     */
    [key: string]: any;
  };
}

/**
 * Type for message handler functions
 */
export type MessageHandler = (message: WickrMessage, args: string[]) => void;

/**
 * Interface for room settings
 */
export interface RoomSettings {
  /**
   * Room members
   */
  members?: string[];
  
  /**
   * Room moderators
   */
  moderators?: string[];
  
  /**
   * Room title
   */
  title?: string;
  
  /**
   * Room description
   */
  description?: string;
}

/**
 * Interface for message properties
 */
export interface MessageProperties {
  /**
   * Metadata for the message
   */
  meta?: Record<string, any>;
  
  /**
   * Additional properties
   */
  [key: string]: any;
}

/**
 * WickrBot is the main class for creating Wickr bots
 */
export declare class WickrBot extends EventEmitter {
  /**
   * The bot's brain for key-value storage
   */
  protected brain: WickrBrain;
  
  /**
   * Registry of command handlers
   */
  protected handlers: HandlerRegistry;
  
  /**
   * Default handler for messages that don't match a command
   */
  protected defaultHandler?: MessageHandler;
  
  /**
   * Handler for file messages
   */
  protected fileHandler?: MessageHandler;
  
  /**
   * The bot's username
   */
  username: string;
  
  /**
   * Help text to display before command list
   */
  helpText?: string;
  
  /**
   * Creates a new WickrBot instance
   * @param wickr - The Wickr API client
   * @param username - The bot's username (optional, will be read from process.argv[2] if not provided)
   */
  constructor(protected wickr: WickrAPI, username?: string);
  
  /**
   * Starts the bot
   */
  start(): Promise<void>;
  
  /**
   * Parses a message to extract command and arguments
   * @param message - The message text to parse
   * @returns The parsed command and arguments
   */
  private _parseMessage(message: string): ParsedMessage;
  
  /**
   * Gets the bot's username from process.argv[2]
   * @returns The username
   * @throws Error if username is not found
   */
  private _getUsername(): string;
  
  /**
   * Sends help text to the user
   * @param msg - The message that triggered the help command
   */
  sendHelp(msg: WickrMessage): void;
  
  /**
   * Creates a message handler function
   * @returns A function that handles incoming messages
   */
  handleMessage(): (message: string) => void;
  
  /**
   * Creates a group conversation
   * @param users - User or users to include in the conversation
   * @returns The result of the operation
   */
  createGroupConvo(users: string | string[]): any;
  
  /**
   * Deletes a group conversation
   * @param vgroupid - The virtual group ID to delete
   * @returns The result of the operation
   */
  deleteGroupConvo(vgroupid: string): any;
  
  /**
   * Creates a room
   * @param users - User or users to include in the room
   * @param moderators - Moderator or moderators for the room
   * @param title - The room title
   * @param description - The room description (optional)
   * @returns The result of the operation
   */
  createRoom(users: string | string[], moderators: string | string[], title: string, description?: string): any;
  
  /**
   * Leaves a room
   * @param vgroupid - The virtual group ID of the room
   * @returns The result of the operation
   */
  leaveRoom(vgroupid: string): any;
  
  /**
   * Deletes a room
   * @param vgroupid - The virtual group ID of the room
   * @returns The result of the operation
   */
  deleteRoom(vgroupid: string): any;
  
  /**
   * Modifies a room's settings
   * @param vgroupid - The virtual group ID of the room
   * @param users - The users to include in the room
   * @param moderators - The moderators for the room
   * @param title - The room title
   * @param description - The room description
   * @returns True if successful
   */
  modifyRoom(vgroupid: string, users: string | string[], moderators: string | string[], title: string, description: string): boolean;
  
  /**
   * Updates a room's settings by merging with existing settings
   * @param vgroupid - The virtual group ID of the room
   * @param settings - The settings to update
   * @returns True if successful
   */
  updateRoom(vgroupid: string, settings: RoomSettings): boolean;
  
  /**
   * Formats room state for update
   * @param state - The room state
   * @returns Formatted room state
   */
  private _formatRoomStateForUpdate(state: any): any;
  
  /**
   * Gets all group conversations
   * @returns The group conversations
   */
  getGroupConvos(): any;
  
  /**
   * Gets all group conversation IDs
   * @returns Array of virtual group IDs
   */
  getGroupConvoIDs(): string[];
  
  /**
   * Gets a room by ID
   * @param vgroupid - The virtual group ID of the room
   * @returns The room information
   */
  getRoom(vgroupid: string): any;
  
  /**
   * Gets all rooms
   * @returns The rooms
   */
  getRooms(): any;
  
  /**
   * Gets all room IDs
   * @returns Array of virtual group IDs
   */
  getRoomIDs(): string[];
  
  /**
   * Gets all users
   * @returns The users
   */
  getUsers(): any;
  
  /**
   * Gets statistics
   * @returns The statistics
   */
  getStats(): any;
  
  /**
   * Clears statistics
   * @returns The result of the operation
   */
  clearStats(): any;
  
  /**
   * Checks if the bot is connected
   * @param timeout - Timeout in seconds
   * @returns True if connected
   */
  isConnected(timeout?: number): boolean;
  
  /**
   * Sends a message to a room (alias for sendMessage)
   * @param room - The virtual group ID of the room
   * @param content - The message content
   * @param properties - Additional message properties
   * @returns The result of the operation
   */
  send(room: string, content: string, properties?: MessageProperties): any;
  
  /**
   * Sends a message to a user
   * @param user - User or users to send the message to
   * @param content - The message content
   * @param properties - Additional message properties
   * @returns The result of the operation
   */
  sendToUser(user: string | string[], content: string, properties?: MessageProperties): any;
  
  /**
   * Sends a message to a room
   * @param room - The virtual group ID of the room
   * @param content - The message content
   * @param properties - Additional message properties
   * @returns The result of the operation
   */
  sendMessage(room: string, content: string, properties?: MessageProperties): any;
  
  /**
   * Sends an attachment to a room
   * @param room - The virtual group ID of the room
   * @param attachment - The attachment path
   * @param displayName - The display name for the attachment
   * @returns The result of the operation
   */
  sendAttachment(room: string, attachment: string, displayName: string): any;
  
  /**
   * Registers a command handler
   * @param command - The command to listen for
   * @param callback - The handler function
   * @param opts - Additional options for the handler
   */
  listen(command: string, callback: MessageHandler, opts?: HandlerOptions): void;
  
  /**
   * Sets the default handler for messages that don't match a command
   * @param fn - The handler function
   */
  setDefaultHandler(fn: MessageHandler): void;
  
  /**
   * Sets the handler for file messages
   * @param fn - The handler function
   */
  setFileHandler(fn: MessageHandler): void;
  
  /**
   * Sets the bot's avatar
   * @param imgPath - Path to the image file
   * @returns True if successful
   * @throws Error if the file doesn't exist
   */
  setAvatar(imgPath: string): boolean;
  
  /**
   * Waits for the client to reach a specific state
   * @param state - The state to wait for
   * @param retries - Number of retries
   * @param interval - Interval between retries in milliseconds
   * @param exponential - Whether to use exponential backoff
   */
  waitForState(state: string, retries?: number, interval?: number, exponential?: boolean): Promise<void>;
}

export { MESSAGE_TYPE };
