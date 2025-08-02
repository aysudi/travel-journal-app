import mongoose from "mongoose";
import journalEntrySchema from "../schemas/journalEntrySchema.js";
const JournalEntry = mongoose.model("JournalEntry", journalEntrySchema);
export default JournalEntry;
