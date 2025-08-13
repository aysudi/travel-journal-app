import ListInvitation from "../models/ListInvitation.js";
import User from "../models/User.js";
import TravelList from "../models/TravelList.js";
import { Types } from "mongoose";
// Get all invitations
const getAllInvitations = async () => {
    try {
        const invitations = await ListInvitation.find()
            .populate("list", "title description coverImage")
            .populate("inviter", "fullName username email profileImage")
            .populate("invitee", "fullName username email profileImage")
            .sort({ createdAt: -1 });
        return invitations;
    }
    catch (error) {
        throw new Error(`Error fetching invitations: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
};
// Get invitation by ID
const getInvitationById = async (id) => {
    try {
        if (!Types.ObjectId.isValid(id)) {
            throw new Error("Invalid invitation ID");
        }
        const invitation = await ListInvitation.findById(id)
            .populate("list", "title description coverImage")
            .populate("inviter", "fullName username email profileImage")
            .populate("invitee", "fullName username email profileImage");
        if (!invitation) {
            throw new Error("Invitation not found");
        }
        return invitation;
    }
    catch (error) {
        throw new Error(`Error fetching invitation: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
};
// Create new invitation
const createInvitation = async (invitationData) => {
    try {
        const { list, inviter, invitee, inviteeEmail, permissionLevel, expiresAt } = invitationData;
        if (!list || !permissionLevel) {
            throw new Error("List and permission level are required");
        }
        if (!invitee && !inviteeEmail) {
            throw new Error("Either invitee ID or inviteeEmail is required");
        }
        if (!Types.ObjectId.isValid(list)) {
            throw new Error("Invalid list ID provided");
        }
        let inviteeId = invitee;
        // If inviteeEmail is provided instead of invitee ID, look up the user
        if (inviteeEmail && !invitee) {
            const inviteeUser = await User.findOne({ email: inviteeEmail });
            if (!inviteeUser) {
                throw new Error("User with this email not found");
            }
            inviteeId = inviteeUser._id.toString();
        }
        if (!inviteeId) {
            throw new Error("Could not determine invitee");
        }
        if (!Types.ObjectId.isValid(inviteeId)) {
            throw new Error("Invalid invitee ID");
        }
        // Check for existing pending invitation
        const existingInvitation = await ListInvitation.findOne({
            list,
            invitee: inviteeId,
            status: "pending",
        });
        if (existingInvitation) {
            throw new Error("Pending invitation already exists for this user and list");
        }
        // Create expiration date if not provided (default 7 days)
        const expirationDate = expiresAt
            ? new Date(expiresAt)
            : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        const newInvitation = new ListInvitation({
            list,
            inviter,
            invitee: inviteeId,
            permissionLevel,
            expiresAt: expirationDate,
        });
        const savedInvitation = await newInvitation.save();
        const populatedInvitation = await ListInvitation.findById(savedInvitation._id)
            .populate("list", "title description coverImage")
            .populate("inviter", "fullName username email profileImage")
            .populate("invitee", "fullName username email profileImage");
        return populatedInvitation;
    }
    catch (error) {
        throw new Error(`Error creating invitation: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
};
// Get invitations by invitee (received invitations)
const getInvitationsByInvitee = async (inviteeId, status) => {
    try {
        if (!Types.ObjectId.isValid(inviteeId)) {
            throw new Error("Invalid invitee ID");
        }
        const query = { invitee: inviteeId };
        if (status) {
            query.status = status;
        }
        const invitations = await ListInvitation.find(query)
            .populate("list", "title description coverImage")
            .populate("inviter", "fullName username email profileImage")
            .sort({ createdAt: -1 });
        return invitations;
    }
    catch (error) {
        throw new Error(`Error fetching invitations by invitee: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
};
// Get invitations by inviter (sent invitations)
const getInvitationsByInviter = async (inviterId, status) => {
    try {
        if (!Types.ObjectId.isValid(inviterId)) {
            throw new Error("Invalid inviter ID");
        }
        const query = { inviter: inviterId };
        if (status) {
            query.status = status;
        }
        const invitations = await ListInvitation.find(query)
            .populate("list", "title description coverImage")
            .populate("invitee", "fullName username email profileImage")
            .sort({ createdAt: -1 });
        return invitations;
    }
    catch (error) {
        throw new Error(`Error fetching invitations by inviter: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
};
// Accept invitation
export const acceptInvitation = async (invitationId, userId) => {
    try {
        const invitation = await ListInvitation.findById(invitationId)
            .populate("inviter", "fullName username email profileImage")
            .populate("invitee", "fullName username email profileImage")
            .populate("list", "title description");
        if (!invitation) {
            throw new Error("Invitation not found");
        }
        // Check if the user is the invitee
        if (invitation.invitee._id.toString() !== userId) {
            throw new Error("You are not authorized to accept this invitation");
        }
        // Check if invitation is still pending
        if (invitation.status !== "pending") {
            throw new Error("Invitation is not pending");
        }
        // Check if invitation has expired
        if (invitation.expiresAt && invitation.expiresAt < new Date()) {
            throw new Error("Invitation has expired");
        }
        // Update invitation status
        invitation.status = "accepted";
        await invitation.save();
        // Add user to the travel list's customPermissions
        const travelList = await TravelList.findById(invitation.list._id);
        if (!travelList) {
            throw new Error("Travel list not found");
        }
        // Check if user already has permissions (to avoid duplicates)
        const existingPermission = travelList.customPermissions.find((permission) => permission.user.toString() === userId);
        if (!existingPermission) {
            // Add new permission entry using findByIdAndUpdate to avoid validation issues
            await TravelList.findByIdAndUpdate(invitation.list._id, {
                $push: {
                    customPermissions: {
                        user: userId,
                        level: invitation.permissionLevel,
                        grantedAt: new Date(),
                        grantedBy: invitation.inviter._id,
                    },
                },
            }, {
                new: true,
                runValidators: false, // Skip validation to avoid coverImage requirement
            });
        }
        else {
            // Update existing permission level if different
            if (existingPermission.level !== invitation.permissionLevel) {
                await TravelList.findByIdAndUpdate(invitation.list._id, {
                    $set: {
                        "customPermissions.$[elem].level": invitation.permissionLevel,
                        "customPermissions.$[elem].grantedAt": new Date(),
                        "customPermissions.$[elem].grantedBy": invitation.inviter._id,
                    },
                }, {
                    arrayFilters: [{ "elem.user": userId }],
                    new: true,
                    runValidators: false, // Skip validation to avoid coverImage requirement
                });
            }
        }
        return invitation;
    }
    catch (error) {
        throw new Error(`Error accepting invitation: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
};
// Reject invitation
export const rejectInvitation = async (invitationId, userId) => {
    try {
        const invitation = await ListInvitation.findById(invitationId)
            .populate("inviter", "fullName username email profileImage")
            .populate("invitee", "fullName username email profileImage")
            .populate("list", "title description");
        if (!invitation) {
            throw new Error("Invitation not found");
        }
        // Check if the user is the invitee
        if (invitation.invitee._id.toString() !== userId) {
            throw new Error("You are not authorized to reject this invitation");
        }
        // Check if invitation is still pending
        if (invitation.status !== "pending") {
            throw new Error("Invitation is not pending");
        }
        // Update invitation status
        invitation.status = "rejected";
        await invitation.save();
        return invitation;
    }
    catch (error) {
        throw new Error(`Error rejecting invitation: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
};
// Cancel invitation (for inviters)
export const cancelInvitation = async (invitationId, userId) => {
    try {
        const invitation = await ListInvitation.findById(invitationId)
            .populate("inviter", "fullName username email profileImage")
            .populate("invitee", "fullName username email profileImage")
            .populate("list", "title description");
        if (!invitation) {
            throw new Error("Invitation not found");
        }
        // Check if the user is the inviter
        if (invitation.inviter._id.toString() !== userId) {
            throw new Error("You are not authorized to cancel this invitation");
        }
        // Check if invitation is still pending
        if (invitation.status !== "pending") {
            throw new Error("Only pending invitations can be canceled");
        }
        // Delete the invitation
        await ListInvitation.findByIdAndDelete(invitationId);
        return { message: "Invitation canceled successfully" };
    }
    catch (error) {
        throw new Error(`Error canceling invitation: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
};
// Helper function to remove user permissions from travel list
export const removeUserPermissions = async (listId, userId) => {
    try {
        const travelList = await TravelList.findById(listId);
        if (!travelList) {
            throw new Error("Travel list not found");
        }
        // Remove user from customPermissions using findByIdAndUpdate
        const result = await TravelList.findByIdAndUpdate(listId, {
            $pull: {
                customPermissions: { user: userId },
            },
        }, {
            new: true,
            runValidators: false, // Skip validation to avoid coverImage requirement
        });
        return { message: "User permissions removed successfully" };
    }
    catch (error) {
        throw new Error(`Error removing user permissions: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
};
export default {
    getAllInvitations,
    getInvitationById,
    createInvitation,
    getInvitationsByInvitee,
    getInvitationsByInviter,
    acceptInvitation,
    rejectInvitation,
    cancelInvitation,
    removeUserPermissions,
};
