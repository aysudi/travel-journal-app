import express from "express";
import {
  createJournalEntry,
  getJournalEntryById,
  updateJournalEntry,
  deleteJournalEntry,
  getJournalEntries,
  getJournalEntriesByDestination,
  getJournalEntriesByAuthor,
  getPublicJournalEntries,
  getJournalEntryStats,
  getRecentJournalEntries,
  bulkUpdateJournalEntries,
  getMyJournalEntries,
  toggleJournalEntryLike,
} from "../controllers/journalEntryController";
import { authenticateToken } from "../middlewares/authMiddleware";

const journalEntryRouter = express.Router();

// Public routes (no authentication required)
journalEntryRouter.get("/public", getPublicJournalEntries);
journalEntryRouter.get(
  "/destination/:destinationId",
  getJournalEntriesByDestination
);
journalEntryRouter.get("/author/:authorId", getJournalEntriesByAuthor);
journalEntryRouter.get("/:id", getJournalEntryById);

// Protected routes (authentication required)
journalEntryRouter.use(authenticateToken);

// User's own journal entries and operations
journalEntryRouter.get("/", getJournalEntries);
journalEntryRouter.get("/my/entries", getMyJournalEntries);
journalEntryRouter.get("/my/stats", getJournalEntryStats);
journalEntryRouter.get("/my/recent", getRecentJournalEntries);

// CRUD operations
journalEntryRouter.post("/", createJournalEntry);
journalEntryRouter.put("/:id", updateJournalEntry);
journalEntryRouter.delete("/:id", deleteJournalEntry);

// Like/unlike operations
journalEntryRouter.patch("/:id/like", toggleJournalEntryLike);

// Bulk operations
journalEntryRouter.patch("/bulk", bulkUpdateJournalEntries);

export default journalEntryRouter;
