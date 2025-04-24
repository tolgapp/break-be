import { Router } from "express";
import { login, signup } from "../controllers/authController";
import {
  getUserById,
  updateUser,
  userOrderHistory,
} from "../controllers/userController";
import { handleCheckout } from "../controllers/checkoutController";

const router = Router();

// User Auth
router.post("/signup", signup);
router.post("/login", login);

// User Controller
router.get("/users/:id", getUserById);
router.post("/users/:id", updateUser);
router.get("/users/:id/receipts", userOrderHistory);

// Checkout Controller
router.post("/checkout", handleCheckout);

export default router;