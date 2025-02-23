import { Request, Response } from "express";
import User from "../models/user.model";

export const handleCheckout = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, products, orderId, total } = req.body;

    if (typeof total !== "number" || total <= 0) {
      res.status(400).send({ message: "Total must be a positive number." });
      return;
    }

    if (
      !userId ||
      !products ||
      !Array.isArray(products) ||
      products.length === 0
    ) {
      res
        .status(400)
        .send({ message: "Invalid request format. Missing required fields." });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).send({ message: "Something went wrong. Please try again later." });
      return;
    }

    const timestamp = new Date().toISOString();

    const receipt = {
      receiptId: orderId || `receipt-${Date.now()}`,
      total,
      timestamp,
      products: products.map((product) => ({
        name: product.name,
        price: product.price,
        size: product.size,
      })),
    };

    user.receipts.push(receipt);

    await user.save();

    res.status(200).send({ message: "Order added to user's profile", receipt });
  } catch (error) {
    console.error("Error during checkout:", error);
    res.status(500).send({ message: "Internal server error." });
  }
}

