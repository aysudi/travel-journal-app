// Main API Service exports
export { apiConfig } from "./apiConfig";
export { authService, userService } from "./authService";
export { travelListService } from "./travelListService";
export {
  destinationService,
  journalEntryService,
  commentService,
} from "./contentService";
export { imageUploadService } from "./imageUploadService";

export type * from "../types/api";

import { apiConfig } from "./apiConfig";
import { authService, userService } from "./authService";
import { travelListService } from "./travelListService";
import {
  destinationService,
  journalEntryService,
  commentService,
} from "./contentService";

export const api = {
  auth: authService,
  user: userService,
  travelLists: travelListService,
  destinations: destinationService,
  journalEntries: journalEntryService,
  comments: commentService,
  config: apiConfig,
} as const;
