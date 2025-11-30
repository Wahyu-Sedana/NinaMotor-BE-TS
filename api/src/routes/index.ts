import { Router } from "express";
import { login, register } from "../controllers/customer/customer";
import { Request, Response } from "express";

const router = Router();

router.post("/login", login);
router.post("/register", register);
router.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "OK" });
});

export default router;
