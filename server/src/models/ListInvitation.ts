import mongoose from "mongoose";
import listInvitationSchema from "../schemas/listInvitationSchema.js";

const ListInvitation = mongoose.model("ListInvitation", listInvitationSchema);

export default ListInvitation;
