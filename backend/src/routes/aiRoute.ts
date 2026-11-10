import { Router } from "express";
import { aiLimiter } from "../middleware/aiLimiter";
import { aiGenerate } from "../controllers/aiControllers";
import { verifyJWT } from "../middleware/verifyJWT";

const router = Router()

router.use(verifyJWT)

router.post("/generate", aiLimiter, aiGenerate)


export default router