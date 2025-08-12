import { Request, Response } from "express";
import listInvitationService from "../services/listInvitationService.js";

// Get all invitations
export const getAllInvitations = async (req: Request, res: Response) => {
  try {
    const invitations = await listInvitationService.getAllInvitations();

    res.status(200).json({
      success: true,
      data: invitations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

// Get invitation by ID
export const getInvitationById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const invitation = await listInvitationService.getInvitationById(id);

    res.status(200).json({
      success: true,
      data: invitation,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error instanceof Error ? error.message : "Invitation not found",
    });
  }
};

// Create new invitation
export const createInvitation = async (req: any, res: Response) => {
  try {
    const { list, invitee, inviteeEmail, permissionLevel, expiresAt } =
      req.body;
    const inviterId = req.user.id;

    const invitation = await listInvitationService.createInvitation({
      list,
      inviter: inviterId,
      invitee,
      inviteeEmail,
      permissionLevel,
      expiresAt,
    });

    res.status(201).json({
      success: true,
      data: invitation,
      message: "Invitation created successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to create invitation",
    });
  }
};

// Get invitations by invitee
export const getInvitationsByInvitee = async (req: Request, res: Response) => {
  try {
    const { inviteeId } = req.params;
    const { status } = req.query;

    const invitations = await listInvitationService.getInvitationsByInvitee(
      inviteeId,
      status as string
    );

    res.status(200).json({
      success: true,
      data: invitations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

// Get invitations by inviter
export const getInvitationsByInviter = async (req: Request, res: Response) => {
  try {
    const { inviterId } = req.params;
    const { status } = req.query;

    const invitations = await listInvitationService.getInvitationsByInviter(
      inviterId,
      status as string
    );

    res.status(200).json({
      success: true,
      data: invitations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

// Accept invitation
export const acceptInvitation = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const invitation = await listInvitationService.acceptInvitation(id, userId);

    res.status(200).json({
      success: true,
      data: invitation,
      message: "Invitation accepted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to accept invitation",
    });
  }
};

// Reject invitation
export const rejectInvitation = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const invitation = await listInvitationService.rejectInvitation(id, userId);

    res.status(200).json({
      success: true,
      data: invitation,
      message: "Invitation rejected successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to reject invitation",
    });
  }
};

// Cancel invitation
export const cancelInvitation = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const result = await listInvitationService.cancelInvitation(id, userId);

    res.status(200).json({
      success: true,
      data: result,
      message: "Invitation canceled successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to cancel invitation",
    });
  }
};
