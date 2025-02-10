import mongoose, { Document, Schema } from "mongoose";

export interface ISettings extends Document {
  siteName: string;
  maintenanceMode: boolean;
  maxMatchRequestsPerWeek: number;
  defaultUserRole: string;
  featureToggles: {
    coFounderMatching: boolean;
    chat: boolean;
    userProfiles: boolean;
    jobFinder: boolean;
    startupProfiles: boolean;
    tutorials: boolean;
    events: boolean;
  };
  emailConfig: {
    senderEmail: string;
    smtpServer: string;
    smtpPort: number;
    smtpUser: string;
    smtpPassword: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

const settingsSchema: Schema = new Schema({
  siteName: {
    type: String,
    required: true,
    default: "Hamnonyan",
  },
  maintenanceMode: {
    type: Boolean,
    required: true,
    default: false,
  },
  maxMatchRequestsPerWeek: {
    type: Number,
    required: true,
    default: 20,
  },
  defaultUserRole: {
    type: String,
    required: true,
    default: "user",
  },
  featureToggles: {
    coFounderMatching: { type: Boolean, default: true },
    chat: { type: Boolean, default: true },
    userProfiles: { type: Boolean, default: true },
    jobFinder: { type: Boolean, default: true },
    startupProfiles: { type: Boolean, default: true },
    tutorials: { type: Boolean, default: false }, // Post-MVP feature
    events: { type: Boolean, default: false }, // Post-MVP feature
  },
  emailConfig: {
    senderEmail: { type: String },
    smtpServer: { type: String },
    smtpPort: { type: Number },
    smtpUser: { type: String },
    smtpPassword: { type: String },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Middleware to update 'updatedAt' before each save
settingsSchema.pre<ISettings>("save", function (next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model<ISettings>("Settings", settingsSchema);
