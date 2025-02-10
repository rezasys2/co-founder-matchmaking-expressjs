import mongoose, { Document, Schema } from "mongoose";

// Chat Document Interface
export interface IChat extends Document {
  participants: mongoose.Schema.Types.ObjectId[]; // Array of two user IDs
  createdAt: Date;
  lastMessageAt?: Date;
}

// Chat Schema
const chatSchema: Schema = new Schema({
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastMessageAt: {
    type: Date,
    default: Date.now,
  },
});

// Ensure that a chat is only created between two unique participants
chatSchema.index({ participants: 1 }, { unique: true });

export default mongoose.model<IChat>("Chat", chatSchema);
