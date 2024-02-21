import User from "@/model/User";
import connect from "@/utils/db";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  await connect();
  try {
    const { email, password } = await req.body;
    console.log(email, password);

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "Email is already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 5);
    const newUser = new User({
      email,
      password: hashedPassword,
    });

    await newUser.save();
    return res.status(200).json({ message: "User is registered" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}
