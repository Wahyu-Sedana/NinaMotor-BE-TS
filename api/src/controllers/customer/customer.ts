import { Request, Response } from "express";
import prisma from "../../helpers/database";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { LoginRequest, RegisterRequest } from "../../types/auth.types";
import { ApiResponse } from "../../config/api_response";

const JWT_SECRET = process.env.JWT_SECRET || "secret_key";

export const login = async (
  req: Request<{}, {}, LoginRequest>,
  res: Response<ApiResponse>
) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await prisma.tb_users.findUnique({ where: { email } });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const register = async (
  req: Request<{}, {}, RegisterRequest>,
  res: Response<ApiResponse>
) => {};
