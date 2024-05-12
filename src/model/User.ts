import mongoose, { Schema, Document } from "mongoose";

export interface Message extends Document {
  content: string;
  createdAt: Date;
}

const MessageSchema: Schema<Message> = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

export interface MessageReply extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  messageId: mongoose.Schema.Types.ObjectId;
  content: string;
  reply: string;
}

const MessageReplySchema: Schema<MessageReply> = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  messageId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  reply: {
    type: String,
    required: true,
  },
});

export interface User extends Document {
  username: string;
  email: string;
  password: string;
  verifyCode: string;
  verifyCodeExpiry: Date;
  isVerified: boolean;
  isAcceptingMessages: boolean;
  messages: Message[];
}

// Updated User schema
const UserSchema: Schema<User> = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    trim: true,
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    match: [/.+\@.+\..+/, "Please use a valid email address"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  verifyCode: {
    type: String,
    required: [true, "Verify Code is required"],
  },
  verifyCodeExpiry: {
    type: Date,
    required: [true, "Verify Code Expiry is required"],
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isAcceptingMessages: {
    type: Boolean,
    default: true,
  },
  messages: [MessageSchema],
});

const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", UserSchema);

const MessageReplyModel =
  (mongoose.models.MessageReply as mongoose.Model<MessageReply>) ||
  mongoose.model<MessageReply>("MessageReply", MessageReplySchema);

const MessageModel = (mongoose.models.Message as mongoose.Model<Message>) ||
mongoose.model<Message>("Message", MessageSchema);

export { MessageReplyModel, MessageModel };
export default UserModel;
