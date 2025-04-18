import User from "../models/user.model";
import { hashPassword } from "../utils/hashUtil";

export const updateUserById = async (id: string, updateData: any) => {
  const { name, surname, email, password } = updateData;
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
    const error = new Error('User not found');
    (error as any).statusCode = 404;
    throw error;
  }

  return updatedUser;
};

export const getUserOrderHistory = async (id: string) => {
  const user = await User.findById(id).populate({
    path: 'receipts',
    options: { sort: { timestamp: -1 } },
  });

  if (!user) {
    const error = new Error('User not found');
    (error as any).statusCode = 404;
    throw error;
  }

  return user.receipts;
};
