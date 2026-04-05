import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { DecodedTokenType } from "../types/decodedToken";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized Access,Please login to continue" });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_ACCESS_SECRET as string,
    ) as DecodedTokenType;

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
