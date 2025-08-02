import mongoose from "mongoose";
import destinationSchema from "../schemas/destinationSchema.js";
// Add indexes for frequently queried fields
destinationSchema.index({ listId: 1 });
destinationSchema.index({ status: 1 });
destinationSchema.index({ country: 1 });
destinationSchema.index({ datePlanned: 1 });
destinationSchema.index({ dateVisited: 1 });
const Destination = mongoose.model("Destination", destinationSchema);
export default Destination;
