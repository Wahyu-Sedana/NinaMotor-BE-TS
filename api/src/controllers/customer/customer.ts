import { Request, Response } from "express";
import prisma from "../../helpers/database";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { LoginRequest, RegisterRequest } from "../../types/auth.types";
import {
  LoginResponse,
  ProfileResponse,
  RegisterResponse,
} from "../../config/api_response";
import { randomUUID } from "crypto";
import { AuthRequest } from "../../middlewares/auth.handler";

const JWT_SECRET = process.env.JWT_SECRET || "secret_key";

export const getProfile = async (
  req: AuthRequest,
  res: Response<ProfileResponse>
) => {
  console.log(req.user);

  return res.json({
    success: true,
    message: "Profile fetched successfully",
    data: req.user,
  });
};

export const register = async (
  req: Request<{}, {}, RegisterRequest>,
  res: Response<RegisterResponse>
) => {
  try {
    const { email, password, c_password, nama, no_telp } = req.body;

    if (!email || !password || !nama) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required",
      });
    }
    const existingUser = await prisma.tb_users.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    if (password !== c_password) {
      return res.status(400).json({
        success: false,
        message: "Password and Confirm Password do not match",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.tb_users.create({
      data: {
        id: randomUUID(),
        nama,
        email,
        password: hashedPassword,
        no_telp: no_telp,
        role: "customer",
      },
    });
    return res.status(200).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const login = async (
  req: Request<{}, {}, LoginRequest>,
  res: Response<LoginResponse>
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
      {
        id: user.id,
        nama: user.nama,
        email: user.email,
        no_telp: user.no_telp,
        role: user.role,
      },
      JWT_SECRET
    );

    const { password: _, ...safeUser } = user;

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: safeUser,
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
