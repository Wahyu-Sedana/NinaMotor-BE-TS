import { Router } from "express";
import { login } from "../controllers/customer/customer";
import { Request, Response } from "express";

const router = Router();

router.post("/login", login);
router.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "OK" });
});

export default router;
