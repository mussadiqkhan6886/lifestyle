import { Router } from "express";
import { apiLimiter } from "../middleware/apiLimiter";
import { sendContactMessage } from "../controllers/contactControllers";

const router = Router()


router.use(apiLimiter)

router.get("/", sendContactMessage)

export default router