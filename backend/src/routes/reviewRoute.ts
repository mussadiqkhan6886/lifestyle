import { Router } from "express";
import { createReview, deleteReview, getAllReviews } from "../controllers/reviewControllers";
import { verifyJWT } from "../middleware/verifyJWT";

const router = Router()

router.get("/", getAllReviews),
router.post("/", createReview)
router.delete("/:id", verifyJWT, deleteReview)

export default router