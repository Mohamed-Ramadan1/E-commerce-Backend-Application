// system imports
import { Response, NextFunction } from "express";

// Models imports
import Message from "../../models/messages/messageModel";
// interfaces imports
import {
  IMessage,
  RecipientType,
} from "../../models/messages/message.interface";
import { MessageRequest } from "../../RequestsInterfaces/messages/messagesRequest.interface";
import { IShop } from "../../models/shop/shop.interface";
// utils imports
import catchAsync from "../../utils/apiUtils/catchAsync";
import AppError from "../../utils/apiUtils/ApplicationError";
import APIFeatures from "../../utils/apiUtils/apiKeyFeature";
import { sendResponse } from "../../utils/apiUtils/sendResponse";
import { ApiResponse } from "../../RequestsInterfaces/response.interface";

// email imports
import sendShopMessage from "../../emails/messages/sendShopMessage";
import sendUserMessage from "../../emails/messages/sendUserMessage";
import { IUser } from "../../models/user/user.interface";

// create and send new message
export const createMessage = catchAsync(
  async (req: MessageRequest, res: Response, next: NextFunction) => {
    const { sender, recipient } = req;
    const { recipientType, subject, content, metaData } = req.body;

    const newMessage: IMessage = new Message({
      sender,
      recipient,
      recipientType,
      subject,
      content,
    });

    if (req.body.metaData !== undefined) {
      newMessage.metaData = req.body.metaData;
    }

    await newMessage.save();
    // sending confirmation email
    if (recipientType === RecipientType.SHOP) {
      sendShopMessage(recipient as IShop, newMessage);
    }

    // send message to user
    if (recipientType === RecipientType.USER) {
      sendUserMessage(recipient as IUser, newMessage);
    }
    const jsonResponse: ApiResponse<IMessage> = {
      status: "success",
      message: "Message created successfully",
      data: newMessage,
    };
    sendResponse(201, jsonResponse, res);
  }
);

// get all messages
export const getMessages = catchAsync(
  async (req: MessageRequest, res: Response, next: NextFunction) => {
    const features = new APIFeatures(Message.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const messages: IMessage[] = await features.execute();

    const jsonResponse: ApiResponse<IMessage[]> = {
      status: "success",
      results: messages.length,
      message: "Messages retrieved successfully",
      data: messages,
    };
    sendResponse(200, jsonResponse, res);
  }
);

// get message
export const getMessage = catchAsync(
  async (req: MessageRequest, res: Response, next: NextFunction) => {
    const message: IMessage | null = await Message.findById(req.params.id);
    if (!message) {
      return next(new AppError("No message found with that ID", 404));
    }
    const jsonResponse: ApiResponse<IMessage> = {
      status: "success",
      message: "Message retrieved successfully",
      data: message,
    };
    sendResponse(200, jsonResponse, res);
  }
);

// update message
export const updateMessage = catchAsync(
  async (req: MessageRequest, res: Response, next: NextFunction) => {
    const message: IMessage | null = await Message.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!message) {
      return next(new AppError("No message found with that ID", 404));
    }
    const jsonResponse: ApiResponse<IMessage> = {
      status: "success",
      message: "Message updated successfully",
      data: message,
    };
    sendResponse(200, jsonResponse, res);
  }
);

// delete message
export const deleteMessage = catchAsync(
  async (req: MessageRequest, res: Response, next: NextFunction) => {
    const message: IMessage | null = await Message.findByIdAndDelete(
      req.params.id
    );
    if (!message) {
      return next(new AppError("No message found with that ID", 404));
    }
    const jsonResponse: ApiResponse<null> = {
      status: "success",
      message: "Message deleted successfully",
      data: null,
    };
    sendResponse(204, jsonResponse, res);
  }
);
