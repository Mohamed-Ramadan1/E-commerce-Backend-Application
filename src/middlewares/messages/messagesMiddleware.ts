// system imports
import { Response, NextFunction } from "express";

// Models imports
import User from "../../models/user/userModel";
import Shop from "../../models/shop/shopModal";
// interfaces imports
import {
  IMessage,
  MessagePriority,
  RecipientType,
} from "../../models/messages/message.interface";
import { MessageRequest } from "../../RequestsInterfaces/messages/messagesRequest.interface";

// utils imports
import catchAsync from "../../utils/apiUtils/catchAsync";
import AppError from "../../utils/apiUtils/ApplicationError";
import { ObjectId } from "mongoose";
import { IUser } from "../../models/user/user.interface";
import { IShop } from "../../models/shop/shop.interface";

type MessageRecipient = IUser | IShop;

enum ErrorMessages {
  MISSING_INFORMATION = "Please provide all required information (recipient, recipientType, subject, content ) .",
  RECIPIENT_NOT_FOUND = "Recipient not found with the provided ID",
}
// Validate the request information
const validateRequestInformation = (req: MessageRequest) => {
  const { recipient, recipientType, subject, content } = req.body;
  if (!recipient || !recipientType || !subject || !content) {
    throw new AppError(ErrorMessages.MISSING_INFORMATION, 400);
  }
};

// Validate the recipient and return the recipient
const validateAndReturnMessageRecipient = async (
  recipientId: ObjectId,
  recipientType: RecipientType
): Promise<MessageRecipient> => {
  let recipientData: MessageRecipient | null = null;

  switch (recipientType) {
    case RecipientType.USER:
      recipientData = await User.findById(recipientId);
      break;
    case RecipientType.SHOP:
      recipientData = await Shop.findById(recipientId);
      break;
    default:
      throw new AppError(ErrorMessages.RECIPIENT_NOT_FOUND, 400);
  }

  if (!recipientData) {
    throw new AppError(ErrorMessages.RECIPIENT_NOT_FOUND, 404);
  }

  return recipientData;
};

export const validateBeforeCreateMessage = catchAsync(
  async (req: MessageRequest, res: Response, next: NextFunction) => {
    const { recipient, recipientType, subject, content } = req.body;
    validateRequestInformation(req);
    const messageRecipient = await validateAndReturnMessageRecipient(
      recipient,
      recipientType
    );

    req.recipient = messageRecipient;
    req.sender = req.user;
    next();
  }
);
