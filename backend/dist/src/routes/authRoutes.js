import { Router } from "express";
import { loginLimiter } from "../middleware/loginLimiter";
import { login, logout, refresh } from "../controllers/authControllers";
const router = Router();
router.post("/login", loginLimiter, login);
router.post("/logout", logout);
router.post("/refresh", refresh);
export default router;
