import { Request, Response } from "express";
import User, { IUser } from "../../models/userModel.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";

// Create a new user
export const registerUser = async (req: Request, res: Response) => {
  try {
    const user: IUser = new User(req.body);
    const savedUser = await user.save();
    res.status(201).json(savedUser);
  } catch (err: any) {
    if (err.name === "ValidationError") {
      // Extract and format validation errors
      const errors = Object.values(err.errors).map(
        (err) => (err as mongoose.Error.ValidatorError).message
      );
      res.status(400).json({ errors });
      return;
    }
    res.status(400).json({ message: err.message });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email: email });
    if (!user) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    // Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: "10d" }
    );

    // Respond with the token
    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        status: user.status,
      },
    });
    return;
  } catch (err: any) {
    res.status(500).json({ message: err.message });
    return;
  }
};

export const logoutUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // If using cookies for token storage, clear the cookie
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Secure flag for production
      sameSite: "strict", // Prevent CSRF
    });

    res.json({ message: "Logout successful" });
    return;
  } catch (err: any) {
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};

export const forgotPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email } = req.body;

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ message: "User with this email does not exist" });
      return;
    }

    // Generate a secure reset token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Set the token and its expiration on the user
    user.passwordResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    user.passwordResetExpires = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000); // Token valid for 2 days
    await user.save();

    // Send the reset token to the user's email
    // const resetURL = `${req.protocol}://${req.get(
    //   "host"
    // )}/users/reset-password/${resetToken}`;
    // const transporter = nodemailer.createTransport({
    //   service: "gmail", // Replace with your email service
    //   auth: {
    //     user: process.env.EMAIL_USER, // Your email
    //     pass: process.env.EMAIL_PASS, // Your email password or app password
    //   },
    // });

    // const mailOptions = {
    //   from: "YourAppName <your-email@example.com>",
    //   to: user.email,
    //   subject: "Password Reset",
    //   html: `<p>You requested to reset your password. Click <a href="${resetURL}">here</a> to reset it. The link is valid for 15 minutes.</p>`,
    // };

    // await transporter.sendMail(mailOptions);

    res.status(200).json({
      message: "Password reset token sent to your email",
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const changePassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { token } = req.params; // Extract token from the URL
    const { newPassword } = req.body; // Extract the new password from the body

    // Hash the token to match the stored hashed token
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Find the user with the matching reset token and ensure the token hasn't expired
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: new Date() }, // Ensure token is still valid
    });

    if (!user) {
      res.status(400).json({ message: "Invalid or expired token" });
      return;
    }

    // Update the user's password and clear the reset token and expiration
    user.password = newPassword; // Password will be hashed automatically by the pre-save middleware
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    // Save the updated user
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
