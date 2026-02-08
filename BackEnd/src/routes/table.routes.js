import { Router } from "express";
import {
  createTable,
  updateTable,
  listTables,
  getTableById,
  claimTable,
  validateSession,
  keepAlive,
  changeTableStatus,
} from "../controllers/table.controller.js";

import { auth } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", auth(["admin","staff"]), listTables);

router.get("/:id", getTableById);

router.post("/", auth(["admin"]), createTable);

router.put("/:id", auth(["admin"]), updateTable);

router.patch("/:id/status", auth(), changeTableStatus);

router.post("/:id/claim", claimTable);

router.get("/:id/validate", validateSession);

router.post("/:id/keep-alive", keepAlive);

export default router;
