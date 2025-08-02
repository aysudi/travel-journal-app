import mongoose from "mongoose";
import travelListSchema from "../schemas/travelListSchema.js";
// Add indexes for frequently queried fields
travelListSchema.index({ owner: 1 });
travelListSchema.index({ isPublic: 1 });
travelListSchema.index({ tags: 1 });
travelListSchema.index({ title: "text", description: "text" }); // Text search
const TravelList = mongoose.model("TravelList", travelListSchema);
export default TravelList;
