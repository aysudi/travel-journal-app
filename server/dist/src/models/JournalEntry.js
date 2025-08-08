import mongoose from "mongoose";
import journalEntrySchema from "../schemas/journalEntrySchema.js";
const JournalEntryModel = mongoose.model("JournalEntry", journalEntrySchema);
export default JournalEntryModel;
