import { Router } from "express";
import {
  getAllInvitations,
  getInvitationById,
  createInvitation,
  getInvitationsByInvitee,
  getInvitationsByInviter,
  acceptInvitation,
  rejectInvitation,
  cancelInvitation,
} from "../controllers/listInvitationController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/", getAllInvitations);
router.get("/invitee/:inviteeId", getInvitationsByInvitee);
router.get("/inviter/:inviterId", getInvitationsByInviter);
router.post("/", authenticateToken, createInvitation);
router.patch("/:id/accept", authenticateToken, acceptInvitation);
router.patch("/:id/reject", authenticateToken, rejectInvitation);
router.delete("/:id/cancel", authenticateToken, cancelInvitation);
router.get("/:id", getInvitationById);

export default router;
