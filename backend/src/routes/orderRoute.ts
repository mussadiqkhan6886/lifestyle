
import { Router } from "express"
import { verifyJWT } from "../middleware/verifyJWT"
import { createOrder, getAllOrders, getSingleOrder, updateOrder } from "../controllers/orderControllers"
import { apiLimiter } from "../middleware/apiLimiter"
import { upload } from "../middleware/upload";

const router = Router()

router.post("/", upload.single("paymentProof") ,createOrder)

router.get("/", verifyJWT ,getAllOrders)
router.get("/:id" ,apiLimiter, getSingleOrder)
router.patch("/:id", verifyJWT ,updateOrder)

export default router
