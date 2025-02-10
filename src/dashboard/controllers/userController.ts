import { Request, Response } from "express";
import User, { IUser } from "../../models/userModel";
import mongoose from "mongoose";

// Create a new user
export const createUser = async (req: Request, res: Response) => {
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

// Get all users
export const getUsers = async (req: Request, res: Response) => {
  try {
    const users: IUser[] = await User.find();
    res.json(users);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// Get a user by ID
export const getUserById = async (req: Request, res: Response) => {
  try {
    const user: IUser | null = await User.findById(req.params.id);
    if (user) res.json(user);
    else res.status(404).json({ message: "User not found" });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// Update a user
export const updateUser = async (req: Request, res: Response) => {
  try {
    const updatedUser: IUser | null = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (updatedUser) res.json(updatedUser);
    else res.status(404).json({ message: "User not found" });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

// Ban a user
export const banUser = async (req: Request, res: Response) => {
  try {
    const updatedUser: IUser | null = await User.findByIdAndUpdate(
      req.params.id,
      { status: "banned" },
      { new: false }
    );
    if (updatedUser) res.json({ message: "Successfully banned!" });
    else res.status(404).json({ message: "User not found" });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a user
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const deletedUser: IUser | null = await User.findByIdAndDelete(
      req.params.id
    );
    if (deletedUser) res.json({ message: "User deleted" });
    else res.status(404).json({ message: "User not found" });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
