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
  getMyJournalEntries,
  toggleJournalEntryLike,
} from "../controllers/journalEntryController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const journalEntryRouter = express.Router();

journalEntryRouter.get("/public", getPublicJournalEntries);
journalEntryRouter.get(
  "/destination/:destinationId",
  getJournalEntriesByDestination
);
journalEntryRouter.get("/author/:authorId", getJournalEntriesByAuthor);
journalEntryRouter.get("/:id", getJournalEntryById);

journalEntryRouter.use(authenticateToken);

journalEntryRouter.get("/", getJournalEntries);
journalEntryRouter.get("/my/entries", getMyJournalEntries);
journalEntryRouter.get("/my/stats", getJournalEntryStats);
journalEntryRouter.get("/my/recent", getRecentJournalEntries);

journalEntryRouter.post("/", createJournalEntry);
journalEntryRouter.put("/:id", updateJournalEntry);
journalEntryRouter.delete("/:id", deleteJournalEntry);

journalEntryRouter.patch("/:id/like", toggleJournalEntryLike);

export default journalEntryRouter;
