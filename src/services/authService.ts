import User from '../models/user.model';
import { comparePassword, hashPassword } from '../utils/hashUtil';

export const registerUser = async ({ name, surname, email, password }: any) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) throw new Error('Email incorrect!');

  const hashedPassword = await hashPassword(password);

  const newUser = new User({
    name,
    surname,
    email,
    password: hashedPassword,
  });

  await newUser.save();
  return newUser;
};

export const authenticateUser = async ({ email, password }: any) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error('User not found.');

  const isValid = await comparePassword(password, user.password);
  if (!isValid) throw new Error('Invalid email or password.');

  return user;
};
