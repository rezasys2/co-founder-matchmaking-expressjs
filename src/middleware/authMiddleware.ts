import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import Admin, { IAdmin } from "../models/adminModel";
import dotenv from "dotenv";

dotenv.config();

interface AuthenticatedRequest extends Request {
  admin?: IAdmin;
}

export const protect = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
        id: string;
      };

      req.admin = await Admin.findById(decoded.id).select("-password");
      if (!req.admin) {
        res.status(401).json({ message: "Not authorized" });
        return;
      }
      next();
    } catch (err: any) {
      res.status(401).json({ message: `Token failed - ${err.message}` });
      return;
    }
  } else {
    res.status(401).json({ message: "No token, authorization denied" });
    return;
  }
};
