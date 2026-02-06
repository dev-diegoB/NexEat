import { Router } from "express";
import {
  googleAuth,
  logout,
  verifyToken,
} from "../controllers/auth.controller.js";

const router = Router();

router.post("/google", googleAuth);
router.post("/logout", logout);
router.get("/verify", verifyToken);

export default router;
