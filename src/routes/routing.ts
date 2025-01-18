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
    .json({ message: "Login successful", userId: user._id, userName: user.name, email: user.email });  } catch (error) {
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
    email:  user?.email,
    password: ""
  })

  
})

export default router;
