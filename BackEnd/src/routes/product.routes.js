import { Router } from "express";
import {
  createProduct,
  getProducts,
  getProductsAdmin,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller.js";
import { auth } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", getProducts);
router.get("/admin", auth(["admin"]), getProductsAdmin);
router.get("/:id", getProductById);

router.post("/", auth(["admin"]), createProduct);
router.put("/:id", auth(["admin"]), updateProduct);
router.delete("/:id", auth(["admin"]), deleteProduct);

export default router;
