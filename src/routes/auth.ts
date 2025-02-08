import { Router } from "express";
import { register, login, logout } from "../controllers/authController";
import { body } from "express-validator";

const router = Router();

router.post(
  "/register",
  [
    body("fullname").notEmpty().withMessage("Ism va familiya kiritish shart"),
    body("phone")
      .matches(/^\+998\d{9}$/)
      .withMessage("Telefon raqam +998XXXXXXXXX formatida bo‘lishi kerak"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Parol kamida 6 ta belgidan iborat bo‘lishi kerak"),
    body("role")
      .optional()
      .isIn(["admin", "omborchi", "sotuvchi", "ishchi"])
      .withMessage("Noto‘g‘ri rol tanlandi"),
  ],
  register
);

router.post(
  "/login",
  [
    body("phone")
      .matches(/^\+998\d{9}$/)
      .withMessage("Telefon raqam +998XXXXXXXXX formatida bo‘lishi kerak"),
    body("password").notEmpty().withMessage("Parol kiritish shart"),
  ],
  login
);

router.post("/logout", logout);

export default router;
