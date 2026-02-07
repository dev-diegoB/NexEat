import { Router } from "express";
import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  getAllCategoriesAdmin,
} from "../controllers/category.controller.js";
import { auth } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/admin", auth(["admin"]), getAllCategoriesAdmin);
router.get("/", getCategories);
router.get("/:id", getCategoryById);

router.post("/", auth(["admin"]), createCategory);
router.put("/:id", auth(["admin"]), updateCategory);
router.delete("/:id", auth(["admin"]), deleteCategory);

export default router;
