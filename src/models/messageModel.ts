import mongoose, { Document, Schema } from "mongoose";

// Message Document Interface
export interface IMessage extends Document {
  chatId: mongoose.Schema.Types.ObjectId;
  senderId: mongoose.Schema.Types.ObjectId;
  content: string;
  sentAt: Date;
}

// Message Schema
const messageSchema: Schema = new Schema({
  chatId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Chat",
    required: true,
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  sentAt: {
    type: Date,
    default: Date.now,
  },
});

// Indexes for performance in querying messages by chat and sent date
messageSchema.index({ chatId: 1, sentAt: 1 });

export default mongoose.model<IMessage>("Message", messageSchema);
