import { Request, Response } from "express";
import User from "../models/user.model";
import { hashPassword } from "../utils/hashUtil";

// Getting the user id from db (mongoDB) 
export const getUserById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const user = await User.findById(req.params.id).select("-password");
  
  if (!user) {
    res.status(404).send({ message: "User not found" });
    return;
  }
  
  res.status(200).json(user);
};

// Update the user if id is found 
export const updateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const { name, surname, email, password } = req.body;

  if (!name && !surname && !email && !password) {
    res
      .status(400)
      .send({ message: "At least one field is required to update." });
    return;
  }

  try {
    const updateFields: { [key: string]: any } = {};
    if (name) updateFields.name = name;
    if (surname) updateFields.surname = surname;
    if (email) updateFields.email = email;
    if (password) updateFields.password = await hashPassword(password);

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      res.status(404).send({ message: "User not found." });
      return;
    }

    res.status(200).json({
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
    res.status(500).send({ message: "Internal server error." });
  }
};

// All user orders from the db 
export const userOrderHistory = async (
  req: Request,
  res: Response
): Promise<void> => {
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
};
