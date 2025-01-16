import { Router } from "express";
import User from "../model/user.model";

const router = Router();

router.post("/signup", async (req, res) => {
  const { name, surname, email, password } = req.body;

  if (!name || !surname || !email || !password) {
    return void res.status(400).send("Each input field must be filled out.");
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return void console.log("Existing User!");
  }

  try {
    const newUser = new User({
      name,
      surname,
      email,
      password,
    });

    await newUser.save();
    return void res.status(201).send("Successfully registered!");
  } catch (error) {
    console.error(error);
    return void res.status(500).send("Register error.");
  }
});


router.post("/login", async (req, res) => {
    const {email, password} = req.body;

    const user = await User.findOne({ email });

    if(!user) return console.log("No user found")
      console.log("BE Message, Logged in!")
    res.send("Logged in!")
})

// TODO: Get the Checkout as "receipt" and save on user account if available
router.post("/checkout", (req,res) => {
  console.log(req.body)
})

export default router;
