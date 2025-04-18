import { Request, Response } from 'express';
import { authenticateUser, registerUser } from '../services/authService';

// Signup function
export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    await registerUser(req.body);
    res.status(201).send({ message: 'Successfully registered!' });
  } catch (error: any) {
    const message = error.message || 'Internal server error.';
    res.status(400).send({ message });
  }
};

// Login function
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await authenticateUser(req.body);

    res.status(200).json({
      message: 'Login successful',
      userId: user._id,
      userName: user.name,
      email: user.email,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).send({ message: 'Internal server error.' });
  }
};
