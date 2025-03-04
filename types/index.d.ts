/**
 * Type definitions for wickrbot
 */

import { WickrBot, WickrMessage, ParsedMessage, HandlerOptions, HandlerRegistry, MessageHandler, RoomSettings, MessageProperties } from './bot';
import { WickrBrain } from './brain';
import { WickrAPI } from './api';
import { MESSAGE_TYPE } from './constants';
import { Message } from './message';

// Export WickrBot as the default export
export default WickrBot;

// Keep named exports for backward compatibility and additional types
export {
  // Bot exports
  WickrBot,
  WickrMessage,
  ParsedMessage,
  HandlerOptions,
  HandlerRegistry,
  MessageHandler,
  RoomSettings,
  MessageProperties,
  
  // Brain exports
  WickrBrain,
  WickrAPI,
  
  // Constants exports
  MESSAGE_TYPE,
};
