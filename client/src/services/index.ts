// Main API Service exports
export { apiConfig } from "./apiConfig";
export { authService, userService } from "./authService";
export { travelListService } from "./travelListService";
export { destinationService, journalEntryService } from "./contentService";

// Export all types
export type * from "../types/api";

// Import services for the main API object
import { apiConfig } from "./apiConfig";
import { authService, userService } from "./authService";
import { travelListService } from "./travelListService";
import { destinationService, journalEntryService } from "./contentService";

// Create a main API object for easy access
export const api = {
  auth: authService,
  user: userService,
  travelLists: travelListService,
  destinations: destinationService,
  journalEntries: journalEntryService,
  config: apiConfig,
} as const;
