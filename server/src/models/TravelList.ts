import mongoose from "mongoose";
import travelListSchema from "../schemas/travelListSchema.js";

const TravelList = mongoose.model("TravelList", travelListSchema);

export default TravelList;
