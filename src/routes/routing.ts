import { Router } from "express";
import bcrypt from "bcrypt";
import User from "../model/user.model";

const router = Router();

router.post("/signup", async (req, res) => {
  const { name, surname, email, password } = req.body;

  if (!name || !surname || !email || !password) {
    return void res.status(400).send("Each input field must be filled out.");
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return void res.status(400).send("Email is already registered.");
  }

  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      name,
      surname,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    return void res.status(201).send("Successfully registered!");
  } catch (error) {
    console.error(error);
    return void res.status(500).send("Register error.");
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return void res.status(400).send("Email and password are required.");
  }

  const user = await User.findOne({ email });

  if (!user) {
    return void res.status(404).send("User not found.");
  }

  try {
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return void res.status(401).send("Invalid email or password.");
    }

    res
      .status(200)
      .json({
        message: "Login successful",
        userId: user._id,
        userName: user.name,
        email: user.email,
      });
  } catch (error) {
    console.error(error);
    return void res.status(500).send("Login error.");
  }
});

router.get("/users/:id", async (req, res) => {
  const userId = req.params.id;

  const user = await User.findById(userId);

  res.json({
    name: user?.name,
    surname: user?.surname,
    email: user?.email,
    password: "",
  });
});

router.post("/users/:id", async (req, res) => {
  const { id } = req.params;
  const { name, surname, email, password } = req.body;
  if (!id) {
    return void res.status(400).send("User ID is required.");
  }

  if (!name && !surname && !email && !password) {
    return void res
      .status(400)
      .send("At least one field is required to update.");
  }

  try {
    let hashedPassword = undefined;
    if (password) {
      const saltRounds = 10;
      hashedPassword = await bcrypt.hash(password, saltRounds);
    }

    const updateFields: { [key: string]: any } = {};
    if (name) updateFields.name = name;
    if (surname) updateFields.surname = surname;
    if (email) updateFields.email = email;
    if (hashedPassword) updateFields.password = hashedPassword;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return void res.status(404).send("User not found.");
    }

    return void res.status(200).json({
      message: "User updated successfully.",
      updatedUser: {
        id: updatedUser._id,
        name: updatedUser.name,
        surname: updatedUser.surname,
        email: updatedUser.email,
      },
    });
  } catch (error) {
    console.error("Update error:", error);
    return void res
      .status(500)
      .send("An error occurred while updating the user.");
  }
});

router.post("/checkout", async (req, res): Promise<void> => {
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
      res.status(404).send({ message: "User not found or not logged in." });
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
});

router.get("/users/:id/receipts", async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id).populate({
      path: "receipts",
      options: { sort: { timestamp: -1 } }, 
    });

    if (!user) {
      res.status(404).send({ message: "User not found" });
      return;
    }

    res.status(200).send(user.receipts);
  } catch (error) {
    console.error("Error fetching receipts:", error);
    res.status(500).send({ message: "Internal server error" });
  }
});

export default router;
