import { Router } from "express";
import { verifyJWT } from "../middleware/verifyJWT";
import { apiLimiter } from "../middleware/apiLimiter";
import { createProduct, deleteProduct, getAllProducts, getHotSellerProducts, getNewArrivals, getSingleProduct, UpdateProduct } from "../controllers/productControllers";
import { upload } from "../middleware/upload";

const router = Router()

router.use(apiLimiter);

router.get("/", getAllProducts);
router.get("/hot-sellers", getHotSellerProducts);
router.get("/new-arrivals", getNewArrivals);
router.get("/:id", getSingleProduct);

router.post("/", verifyJWT, upload.any(), createProduct);
router.patch("/:id", verifyJWT, upload.any(), UpdateProduct);
router.delete("/:id", verifyJWT, deleteProduct);

export default router