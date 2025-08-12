import ListInvitation from "../models/ListInvitation.js";
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
  } catch (error) {
    throw new Error(
      `Error fetching invitations: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};

// Get invitation by ID
const getInvitationById = async (id: string) => {
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
  } catch (error) {
    throw new Error(
      `Error fetching invitation: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};

// Create new invitation
const createInvitation = async (invitationData: {
  list: string;
  inviter: string;
  invitee: string;
  permissionLevel: string;
}) => {
  try {
    // Validate required fields
    const { list, inviter, invitee, permissionLevel } = invitationData;

    if (!list || !inviter || !invitee || !permissionLevel) {
      throw new Error(
        "All fields (list, inviter, invitee, permissionLevel) are required"
      );
    }

    // Validate ObjectIds
    if (
      !Types.ObjectId.isValid(list) ||
      !Types.ObjectId.isValid(inviter) ||
      !Types.ObjectId.isValid(invitee)
    ) {
      throw new Error("Invalid ObjectId provided");
    }

    // Check if invitation already exists for this user and list
    const existingInvitation = await ListInvitation.findOne({
      list,
      invitee,
      status: "pending",
    });

    if (existingInvitation) {
      throw new Error(
        "Pending invitation already exists for this user and list"
      );
    }

    const newInvitation = new ListInvitation({
      list,
      inviter,
      invitee,
      permissionLevel,
    });

    const savedInvitation = await newInvitation.save();

    // Populate the saved invitation before returning
    const populatedInvitation = await ListInvitation.findById(
      savedInvitation._id
    )
      .populate("list", "title description coverImage")
      .populate("inviter", "fullName username email profileImage")
      .populate("invitee", "fullName username email profileImage");

    return populatedInvitation;
  } catch (error) {
    throw new Error(
      `Error creating invitation: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};

// Get invitations by invitee (received invitations)
const getInvitationsByInvitee = async (inviteeId: string, status?: string) => {
  try {
    if (!Types.ObjectId.isValid(inviteeId)) {
      throw new Error("Invalid invitee ID");
    }

    const query: any = { invitee: inviteeId };
    if (status) {
      query.status = status;
    }

    const invitations = await ListInvitation.find(query)
      .populate("list", "title description coverImage")
      .populate("inviter", "fullName username email profileImage")
      .sort({ createdAt: -1 });

    return invitations;
  } catch (error) {
    throw new Error(
      `Error fetching invitations by invitee: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};

// Get invitations by inviter (sent invitations)
const getInvitationsByInviter = async (inviterId: string, status?: string) => {
  try {
    if (!Types.ObjectId.isValid(inviterId)) {
      throw new Error("Invalid inviter ID");
    }

    const query: any = { inviter: inviterId };
    if (status) {
      query.status = status;
    }

    const invitations = await ListInvitation.find(query)
      .populate("list", "title description coverImage")
      .populate("invitee", "fullName username email profileImage")
      .sort({ createdAt: -1 });

    return invitations;
  } catch (error) {
    throw new Error(
      `Error fetching invitations by inviter: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};

export default {
  getAllInvitations,
  getInvitationById,
  createInvitation,
  getInvitationsByInvitee,
  getInvitationsByInviter,
};
