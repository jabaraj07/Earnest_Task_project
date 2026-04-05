import express from "express";
import {
  LoginUser,
  LogoutUser,
  RefreshToken,
  RegisterUser,
  GetCurrentUser,
} from "../controller/authController";
import { authMiddleware } from "../middleware/authMiddleware";
const router = express.Router();

router.post("/register", RegisterUser);
router.post("/login", LoginUser);

router.post("/refresh", RefreshToken);
router.post("/logout", LogoutUser);
router.get("/me", authMiddleware, GetCurrentUser);

export default router;
