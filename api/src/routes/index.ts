import { Router } from "express";
import { getProfile, login, register } from "../controllers/customer/customer";
import { Request, Response } from "express";
import { authenticateToken } from "../middlewares/auth.handler";
import { getTranslations } from "../controllers/translation";

const router = Router();

router.get("/translations", getTranslations);

router.post("/login", login);
router.post("/register", register);
router.get("/profile", authenticateToken, getProfile);
router.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "OK" });
});

export default router;
