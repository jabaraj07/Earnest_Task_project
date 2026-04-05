import { Request, Response } from "express";
import { loginSchema, registerSchema } from "../validations/auth.validation";
import { z } from "zod";
import prisma from "../prisma";
import bcrypt from "bcryptjs";
import { generateAccessToken, generateRefreshToken } from "../config/jwt";
import jwt from "jsonwebtoken";
import { Session } from "../types/session";

export const RegisterUser = async (req: Request, res: Response) => {
  try {
    const validateData = registerSchema.safeParse(req.body);
    if (!validateData.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: z.treeifyError(validateData.error),
      });
    }
    const { name, email, password } = req.body;

    const ExistingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (ExistingUser) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }

    const hashPassword = await bcrypt.hash(password, 11);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashPassword,
      },
    });
    if (!newUser) {
      return res.status(500).json({ message: "Failed to create user" });
    }

    return res
      .status(201)
      .json({ message: "User Registered Successfully", user: newUser });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const LoginUser = async (req: Request, res: Response) => {
  try {
    const validateData = loginSchema.safeParse(req.body);
    if (!validateData.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: z.treeifyError(validateData.error),
      });
    }
    const { email, password } = req.body;

    const ExistingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (!ExistingUser) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      ExistingUser.password,
    );

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }
    const token = generateAccessToken({
      id: ExistingUser.id,
      email: ExistingUser.email,
    });
    const RefreshToken = generateRefreshToken({
      id: ExistingUser.id,
      email: ExistingUser.email,
    });

    if (!token || !RefreshToken) {
      return res.status(500).json({ message: "Failed to genetrate Token" });
    }

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", RefreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const refreshTokenExpiresAt = new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000,
    );

    await prisma.session.deleteMany({
      where: { userId: ExistingUser.id },
    });
    const RefreshSession = await prisma.session.create({
      data: {
        userId: ExistingUser.id,
        refreshTokenHash: await bcrypt.hash(RefreshToken, 11),
        expiresAt: refreshTokenExpiresAt,
      },
    });

    return res.status(200).json({ message: "Login Success", RefreshSession });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const RefreshToken = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res
        .status(401)
        .json({ message: "unAuthorized RefreshToken Required" });
    }
    const decodedToken = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET as string,
    ) as { id: number; email: string };

    const session: Session[] = await prisma.session.findMany({
      where: { userId: decodedToken.id },
    });

    if (!session || session.length === 0) {
      return res
        .status(401)
        .json({ message: "Session not found, Please login again" });
    }

    const matchingSession = session.find((s) =>
      bcrypt.compareSync(refreshToken, s.refreshTokenHash),
    );

    if (!matchingSession) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const isExpired = matchingSession.expiresAt.getTime() < Date.now();

    if (isExpired) {
      return res.status(401).json({ message: "Refresh token expired" });
    }

    const token = generateAccessToken({
      id: decodedToken.id,
      email: decodedToken.email,
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 15 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Access token refreshed successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const LogoutUser = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      res.clearCookie("token");
      res.clearCookie("refreshToken");

      return res.status(200).json({
        message: "Logged out successfully",
      });
    }

    let decodedToken: { id: number; email: string };
    try {
      decodedToken = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET as string,
      ) as { id: number; email: string };
    } catch (error) {
      res.clearCookie("token");
      res.clearCookie("refreshToken");

      return res.status(200).json({
        message: "Logged out successfully",
      });
    }

    const session: Session[] = await prisma.session.findMany({
      where: { userId: decodedToken.id },
    });

    if (!session || session.length === 0) {
      return res
        .status(401)
        .json({ message: "Session not found, Please login again" });
    }

    const matchingSession = session.find((s) =>
      bcrypt.compareSync(refreshToken, s.refreshTokenHash),
    );

    if (matchingSession) {
      await prisma.session.delete({
        where: { id: matchingSession.id },
      });
    }

    res.clearCookie("token");
    res.clearCookie("refreshToken");

    return res.status(200).json({
      message: "Logged out successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const GetCurrentUser = async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: "UnAuthorized" });
  }
  try {
    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!currentUser) {
      return res.status(404).json({ message: "User Not Found" });
    }
    return res.status(200).json({ message: "Current User", user: currentUser });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
