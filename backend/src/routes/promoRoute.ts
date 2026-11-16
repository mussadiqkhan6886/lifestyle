import { Router } from "express";
import { verifyJWT } from "../middleware/verifyJWT";
import {
  createPromo,
  getAllPromos,
  getPromoById,
  updatePromo,
  deletePromo,
  verifyPromo,
} from "../controllers/promoControllers";

const router = Router();

// Public: Customer verifies promo code at checkout
router.post("/verify", verifyPromo);

// Admin only: create, view, update, delete promo codes
router.get("/", verifyJWT, getAllPromos);
router.get("/:id", verifyJWT, getPromoById);
router.post("/", verifyJWT, createPromo);
router.patch("/:id", verifyJWT, updatePromo);
router.delete("/:id", verifyJWT, deletePromo);

export default router;
