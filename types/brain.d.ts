import { WickrAPI } from "./api"

/**
 * WickrBrain provides a simple key-value store interface for the bot
 */
export declare class WickrBrain {
  /**
   * Creates a new WickrBrain instance
   * @param wickr - The Wickr API client
   */
  constructor(private wickr: WickrAPI);
  
  /**
   * Gets a value from the key-value store
   * @param key - The key to retrieve
   * @returns The value associated with the key, or null if not found
   */
  get(key: string): string | null;
  
  /**
   * Sets a value in the key-value store
   * @param key - The key to set
   * @param value - The value to store
   * @returns True if successful
   */
  set(key: string, value: string): boolean;
  
  /**
   * Deletes a key-value pair from the store
   * @param key - The key to delete
   * @returns True if successful
   */
  delete(key: string): boolean;
  
  /**
   * Clears all key-value pairs from the store
   * @returns True if successful
   */
  clear(): boolean;
}
