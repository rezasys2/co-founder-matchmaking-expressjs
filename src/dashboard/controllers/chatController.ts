import { Request, Response } from "express";
import Chat, { IChat } from "../../models/chatModel";
import Message, { IMessage } from "../../models/messageModel";

// Get all chat requests with requester and recipient names
export const getChats = async (req: Request, res: Response) => {
  try {
    const rows: IChat[] = await Chat.find().populate(
      "participants",
      "firstName lastName"
    ); // Fetch only firstName and lastName for requester

    res.json(rows);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// Get all messages in a specific chat with sender names
export const getChatMessages = async (req: Request, res: Response) => {
  try {
    const chatId = req.params.id;
    // Find messages by chatId and populate sender's firstName and lastName
    const messages = await Message.find({ chatId })
      .populate("senderId", "firstName lastName") // Fetch only firstName and lastName for sender
      .sort({ sentAt: 1 }); // Sort messages by sentAt in ascending order

    if (!messages.length) {
      res.status(404).json({ message: "No messages found for this chat" });
      return;
    }

    res.json(messages);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
