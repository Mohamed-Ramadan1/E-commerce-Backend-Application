import { Schema, Model, model } from "mongoose";
import { IMessage, MessagePriority, RecipientType } from "./message.interface";
const messageSchema: Schema = new Schema<IMessage>(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipient: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipientType: {
      type: String,
      enum: Object.values(RecipientType),
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    metaData: {
      category: {
        type: String,
        required: false,
      },
      priority: {
        type: String,
        enum: [
          MessagePriority.LOW,
          MessagePriority.MEDIUM,
          MessagePriority.HIGH,
        ],
        required: false,
      },
      tags: {
        type: [String],
        required: false,
      },
      actionRequired: {
        type: Boolean,
        required: false,
      },
    },
  },
  {
    timestamps: true,
  }
);

const Message: Model<IMessage> = model<IMessage>("Message", messageSchema);

export default Message;
