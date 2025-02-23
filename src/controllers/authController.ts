import { Request, Response } from "express";
import User from "../models/user.model";
import { hashPassword, comparePassword } from "../utils/hashUtil";

// Signup function
export const signup = async (req: Request, res: Response): Promise<void> => {
  const { name, surname, email, password } = req.body;
  
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(400).send({ message: "Email already in use." });
    return;
  }
  
  try {
    const hashedPassword = await hashPassword(password);
    const newUser = new User({
      name,
      surname,
      email,
      password: hashedPassword,
    });
    
    await newUser.save();
    res.status(201).send({ message: "Successfully registered!" });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).send({ message: "Internal server error." });
  }
};

// Login function
export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  
  const user = await User.findOne({ email });
  if (!user) {
    res.status(404).send({ message: "User not found." });
    return;
  }
  
  try {
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      res.status(401).send({ message: "Invalid email or password." });
      return;
    }
    
    res.status(200).json({
      message: "Login successful",
      userId: user._id,
      userName: user.name,
      email: user.email,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).send({ message: "Internal server error." });
  }
};