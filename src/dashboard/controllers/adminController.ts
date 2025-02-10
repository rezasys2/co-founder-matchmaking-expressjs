import { Request, Response } from "express";
import Admin, { IAdmin } from "../../models/adminModel";
import jwt from "jsonwebtoken";

//Login an admin
export const loginAdmin = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username: username });
    if (!admin) {
      res.status(401).json({ message: "z Invalid credentials" });
      return;
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({ message: "s Invalid credentials" });
      return;
    }

    // Generate JWT
    const token = jwt.sign(
      { id: admin._id },
      process.env.JWT_SECRET as string
      //   {
      //     expiresIn: "7d",
      //   }
    );

    res.json({ token });
    return;
  } catch (err: any) {
    res.status(500).json({ message: err.message });
    return;
  }
};
