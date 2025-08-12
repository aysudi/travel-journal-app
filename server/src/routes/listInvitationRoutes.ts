import { Router } from "express";
import {
  getAllInvitations,
  getInvitationById,
  createInvitation,
  getInvitationsByInvitee,
  getInvitationsByInviter,
} from "../controllers/listInvitationController.js";

const router = Router();

router.get("/", getAllInvitations);
router.post("/", createInvitation);
router.get("/invitee/:inviteeId", getInvitationsByInvitee);
router.get("/inviter/:inviterId", getInvitationsByInviter);
router.get("/:id", getInvitationById);

export default router;
