import mongoose from "mongoose";
import destinationSchema from "../schemas/destinationSchema.js";

const Destination = mongoose.model("Destination", destinationSchema);

export default Destination;
