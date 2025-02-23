import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

// Hashing password with bcrypt 
export const hashPassword = async (password: string): Promise<string> => {
  // Securing it with 10 salt rounds
  return await bcrypt.hash(password, SALT_ROUNDS);
};

// Comparing the password with bcrypt compare method
export const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};