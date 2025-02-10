import mongoose, { Document, Schema } from "mongoose";

// Enum for Match Request Status
const matchStatusOptions = ["pending", "accepted", "rejected"] as const;
type MatchStatus = (typeof matchStatusOptions)[number];

// Interface for MatchRequest Document
export interface IMatchRequest extends Document {
  requesterId: mongoose.Schema.Types.ObjectId;
  recipientId: mongoose.Schema.Types.ObjectId;
  status: MatchStatus;
  requestedAt: Date;
  respondedAt?: Date;
}

// MatchRequest Schema
const matchRequestSchema: Schema = new Schema({
  requesterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  recipientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: matchStatusOptions,
    default: "pending",
  },
  requestedAt: {
    type: Date,
    default: Date.now,
  },
  respondedAt: {
    type: Date,
  },
});

export default mongoose.model<IMatchRequest>(
  "MatchRequest",
  matchRequestSchema
);
