import { Request, Response } from "express";
import MatchRequest, { IMatchRequest } from "../../models/matchModel.js";

// Get all match requests with requester and recipient names
export const getMatch = async (req: Request, res: Response) => {
  try {
    const rows: IMatchRequest[] = await MatchRequest.find()
      .populate("requesterId", "firstName lastName") // Fetch only firstName and lastName for requester
      .populate("recipientId", "firstName lastName"); // Fetch only firstName and lastName for recipient

    res.json(rows);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const updateMatch = async (req: Request, res: Response) => {
  try {
    // Extract status only from req.body
    const { status } = req.body;

    // Validate that status is provided and is an allowed value
    if (!status || !["pending", "accepted", "rejected"].includes(status)) {
      res.status(400).json({ message: "Invalid or missing status" });
      return;
    }

    // Update only the status field
    const updatedRow: IMatchRequest | null =
      await MatchRequest.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: false }
      );

    if (updatedRow) res.json(updatedRow);
    else res.status(404).json({ message: "Row not found" });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};
