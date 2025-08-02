import mongoose from "mongoose";
import journalEntrySchema from "../schemas/journalEntrySchema.js";
// Add indexes for frequently queried fields
journalEntrySchema.index({ destination: 1 });
journalEntrySchema.index({ author: 1 });
journalEntrySchema.index({ public: 1 });
journalEntrySchema.index({ createdAt: -1 }); // For chronological sorting
const JournalEntry = mongoose.model("JournalEntry", journalEntrySchema);
export default JournalEntry;
