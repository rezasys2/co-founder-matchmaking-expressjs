import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcrypt";

const emailPreferenceOptions = [
  "All emails",
  "Necessary emails only",
  "No lifecycle emails, ever",
] as const;
const userStatusOptions = ["unverified", "verified", "banned"] as const;

type EmailPreference = (typeof emailPreferenceOptions)[number];
type UserStatus = (typeof userStatusOptions)[number];

export interface IUser extends Document {
  // Basic Information
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  status: UserStatus;

  // User Avatar
  avatar?: string;

  // LinkedIn Profile
  hasLinkedIn?: boolean;
  linkedInURL?: string;

  // More Information
  education?: string[];
  employment?: string[];
  location?: string;
  accomplishment?: string;
  activelyWorkingOnStartup?: boolean;
  isTechnical?: boolean;
  seekingCoFounder?: boolean;
  gender?: string;
  birthdate?: Date;
  heardAboutUs?: string;
  emailPreferences?: EmailPreference[];
  passwordResetToken?: string;
  passwordResetExpires?: Date;

  // Account Management
  createdAt?: Date;

  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema: Schema = new Schema({
  // Basic Information
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: userStatusOptions,
    default: "unverified",
  },
  // User Avatar
  avatar: {
    type: String,
    default: "",
  },
  // LinkedIn Profile
  hasLinkedIn: {
    type: Boolean,
    default: true,
  },
  linkedInURL: {
    type: String,
    trim: true,
    required: function () {
      return this.hasLinkedIn;
    },
  },
  // More Information
  education: {
    type: [String],
  },
  employment: {
    type: [String],
  },
  location: {
    type: String,
    trim: true,
  },
  accomplishment: {
    type: String,
    maxlength: 1000,
    trim: true,
  },
  activelyWorkingOnStartup: {
    type: Boolean,
  },
  isTechnical: {
    type: Boolean,
  },
  seekingCoFounder: {
    type: Boolean,
  },
  gender: {
    type: String,
    trim: true,
  },
  birthdate: {
    type: Date,
  },
  heardAboutUs: {
    type: String,
    trim: true,
  },
  emailPreferences: {
    type: [String],
    enum: emailPreferenceOptions,
  },
  passwordResetToken: {
    type: String,
  },
  passwordResetExpires: {
    type: Date,
  },
  // Account Management
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash password before saving
userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err: any) {
    next(err);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUser>("User", userSchema);
