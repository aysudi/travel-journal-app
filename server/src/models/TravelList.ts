import mongoose from "mongoose";
import travelListSchema from "../schemas/travelListSchema.js";

const TravelListModel = mongoose.model("TravelList", travelListSchema);

export default TravelListModel;
