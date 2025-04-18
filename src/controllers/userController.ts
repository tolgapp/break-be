import { Request, Response } from 'express';
import User from '../models/user.model';
import { getUserOrderHistory, updateUserById } from '../services/userService';

// Getting the user id from db (mongoDB)
export const getUserById = async (req: Request, res: Response): Promise<void> => {
  const user = await User.findById(req.params.id).select('-password');

  if (!user) {
    res.status(404).send({ message: 'User not found' });
    return;
  }

  res.status(200).json(user);
};

// Update the user if id is found
export const updateUser = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const updatedUser = updateUserById(id, req.body);
    res.status(200).json({
      message: 'User updated successfully.',
      updatedUser,
    });
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).send({ message: 'Internal server error.' });
  }
};

// All user orders from the db
export const userOrderHistory = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const receipts = await getUserOrderHistory(id);
    res.status(200).send(receipts);
  } catch (error: any) {
    console.error('Error fetching receipts:', error);
    res
      .status(error.statusCode || 500)
      .send({ message: 'Internal server error' });
  }
};
