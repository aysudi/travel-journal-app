import mongoose from "mongoose";
import TravelList from "../models/TravelList.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";

class CollaborationService {
  // Join or request to join a travel list based on privacy
  static async joinOrRequestToJoin(
    travelListId: mongoose.Types.ObjectId,
    userId: mongoose.Types.ObjectId,
    requestMessage?: string
  ) {
    const travelList = await TravelList.findById(travelListId).populate(
      "owner",
      "fullName"
    );
    const user = await User.findById(userId).select("fullName username");

    if (!travelList) {
      throw new Error("Travel list not found");
    }

    if (!user) {
      throw new Error("User not found");
    }

    // Check if user is already owner
    if (travelList.owner._id.toString() === userId.toString()) {
      throw new Error("You are already the owner of this list");
    }

    // Check if user is already a collaborator
    const isCollaborator = travelList.collaborators.some(
      (collaboratorId: mongoose.Types.ObjectId) =>
        collaboratorId.toString() === userId.toString()
    );

    if (isCollaborator) {
      throw new Error("You are already a collaborator on this list");
    }

    // Check if user already has a pending request
    const hasPendingRequest = travelList.pendingRequests.some(
      (request: any) => request.user.toString() === userId.toString()
    );

    if (hasPendingRequest) {
      throw new Error("You already have a pending request for this list");
    }

    if (travelList.isPublic) {
      // PUBLIC LIST: Direct join as Editor
      travelList.collaborators.push(userId);
      await travelList.save();

      // Update user's collaborating lists
      await User.findByIdAndUpdate(userId, {
        $push: { collaboratingLists: travelListId },
      });

      // Send notification to owner about new collaborator
      await Notification.create({
        recipient: travelList.owner._id,
        sender: userId,
        type: "list_shared",
        title: "New Collaborator Joined",
        message: `${user.fullName} (@${user.username}) joined your travel list "${travelList.title}"`,
        relatedTravelList: travelListId,
      });

      return {
        success: true,
        action: "joined",
        message: "Successfully joined the travel list as an Editor",
      };
    } else {
      // PRIVATE LIST: Send request
      travelList.pendingRequests.push({
        user: userId,
        requestedAt: new Date(),
        message: requestMessage || "",
      });
      await travelList.save();

      // Send notification to owner about collaboration request
      await Notification.create({
        recipient: travelList.owner._id,
        sender: userId,
        type: "list_invite",
        title: "Collaboration Request",
        message: `${user.fullName} (@${
          user.username
        }) wants to collaborate on "${travelList.title}"${
          requestMessage ? `: "${requestMessage}"` : ""
        }`,
        relatedTravelList: travelListId,
      });

      return {
        success: true,
        action: "requested",
        message: "Collaboration request sent to the owner",
      };
    }
  }

  // Approve collaboration request (Owner only)
  static async approveRequest(
    travelListId: mongoose.Types.ObjectId,
    requesterId: mongoose.Types.ObjectId,
    ownerId: mongoose.Types.ObjectId
  ) {
    const travelList = await TravelList.findById(travelListId);

    if (!travelList) {
      throw new Error("Travel list not found");
    }

    // Check if user is the owner
    if (travelList.owner.toString() !== ownerId.toString()) {
      throw new Error("Only the owner can approve collaboration requests");
    }

    // Find and remove the pending request
    const requestIndex = travelList.pendingRequests.findIndex(
      (request: any) => request.user.toString() === requesterId.toString()
    );

    if (requestIndex === -1) {
      throw new Error("No pending request found for this user");
    }

    travelList.pendingRequests.splice(requestIndex, 1);

    // Add user as collaborator
    travelList.collaborators.push(requesterId);
    await travelList.save();

    // Update user's collaborating lists
    await User.findByIdAndUpdate(requesterId, {
      $push: { collaboratingLists: travelListId },
    });

    // Get requester info for notification
    const requester = await User.findById(requesterId).select(
      "fullName username"
    );

    // Notify requester that request was approved
    await Notification.create({
      recipient: requesterId,
      sender: ownerId,
      type: "list_shared",
      title: "Collaboration Request Approved!",
      message: `Your request to collaborate on "${travelList.title}" has been approved. You are now an Editor!`,
      relatedTravelList: travelListId,
    });

    return {
      success: true,
      message: `${requester?.fullName} has been added as a collaborator`,
    };
  }

  // Reject collaboration request (Owner only)
  static async rejectRequest(
    travelListId: mongoose.Types.ObjectId,
    requesterId: mongoose.Types.ObjectId,
    ownerId: mongoose.Types.ObjectId
  ) {
    const travelList = await TravelList.findById(travelListId);

    if (!travelList) {
      throw new Error("Travel list not found");
    }

    // Check if user is the owner
    if (travelList.owner.toString() !== ownerId.toString()) {
      throw new Error("Only the owner can reject collaboration requests");
    }

    // Find and remove the pending request
    const requestIndex = travelList.pendingRequests.findIndex(
      (request: any) => request.user.toString() === requesterId.toString()
    );

    if (requestIndex === -1) {
      throw new Error("No pending request found for this user");
    }

    travelList.pendingRequests.splice(requestIndex, 1);
    await travelList.save();

    // Get requester info for notification
    const requester = await User.findById(requesterId).select(
      "fullName username"
    );

    // Notify requester that request was rejected
    await Notification.create({
      recipient: requesterId,
      sender: ownerId,
      type: "system",
      title: "Collaboration Request Declined",
      message: `Your request to collaborate on "${travelList.title}" was declined.`,
      relatedTravelList: travelListId,
    });

    return {
      success: true,
      message: `Request from ${requester?.fullName} has been rejected`,
    };
  }

  // Remove collaborator (Owner only)
  static async removeCollaborator(
    travelListId: mongoose.Types.ObjectId,
    collaboratorId: mongoose.Types.ObjectId,
    ownerId: mongoose.Types.ObjectId
  ) {
    const travelList = await TravelList.findById(travelListId);

    if (!travelList) {
      throw new Error("Travel list not found");
    }

    // Check if user is the owner
    if (travelList.owner.toString() !== ownerId.toString()) {
      throw new Error("Only the owner can remove collaborators");
    }

    // Find and remove collaborator
    const collaboratorIndex = travelList.collaborators.findIndex(
      (collabId: mongoose.Types.ObjectId) =>
        collabId.toString() === collaboratorId.toString()
    );

    if (collaboratorIndex === -1) {
      throw new Error("User is not a collaborator on this list");
    }

    travelList.collaborators.splice(collaboratorIndex, 1);
    await travelList.save();

    // Update user's collaborating lists
    await User.findByIdAndUpdate(collaboratorId, {
      $pull: { collaboratingLists: travelListId },
    });

    // Get collaborator info
    const collaborator = await User.findById(collaboratorId).select(
      "fullName username"
    );

    // Notify removed collaborator
    await Notification.create({
      recipient: collaboratorId,
      sender: ownerId,
      type: "system",
      title: "Removed from Travel List",
      message: `You have been removed from the travel list "${travelList.title}"`,
      relatedTravelList: travelListId,
    });

    return {
      success: true,
      message: `${collaborator?.fullName} has been removed from the travel list`,
    };
  }

  // Get pending requests for a travel list (Owner only)
  static async getPendingRequests(
    travelListId: mongoose.Types.ObjectId,
    ownerId: mongoose.Types.ObjectId
  ) {
    const travelList = await TravelList.findById(travelListId).populate(
      "pendingRequests.user",
      "fullName username email profileImage"
    );

    if (!travelList) {
      throw new Error("Travel list not found");
    }

    // Check if user is the owner
    if (travelList.owner.toString() !== ownerId.toString()) {
      throw new Error("Only the owner can view pending requests");
    }

    return travelList.pendingRequests;
  }

  // Get user's role in a travel list (Frontend helper)
  static getUserRole(
    travelList: any,
    userId: mongoose.Types.ObjectId
  ): "Owner" | "Editor" | null {
    // Check if user is owner
    if (travelList.owner.toString() === userId.toString()) {
      return "Owner";
    }

    // Check if user is collaborator (Editor)
    const isCollaborator = travelList.collaborators.some(
      (collaboratorId: mongoose.Types.ObjectId) =>
        collaboratorId.toString() === userId.toString()
    );

    return isCollaborator ? "Editor" : null;
  }
}

export default CollaborationService;
