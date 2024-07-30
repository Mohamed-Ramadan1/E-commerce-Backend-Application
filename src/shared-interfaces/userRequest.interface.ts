import { AuthUserRequest } from "./request.interface";
import { IUser } from "../models/user.interface";

export interface UserRequest extends AuthUserRequest {
  params: {
    id: string;
  };
}

export interface UserRequestWithUpdateInfo extends UserRequest {
  body: {
    password?: string;
    passwordConfirmation?: string;
    role?: string;
    verified?: boolean;
    active?: boolean;
    passwordResetToken?: string;
    passwordResetExpires?: Date;
    shoppingCart?: string;
    emailToken?: String;
    giftCard?: number;
    myShop?: string;

    name: string;
    email: string;
    phoneNumber: string;
    photo: string;
    photoPublicId: string;
    address: string;
    shippingAddress: string;
  };
}

export interface UserUpdatePasswordRequest extends UserRequest {
  body: {
    currentPassword: string;
    newPassword: string;
    passwordConfirmation: string;
  };
}

export interface UserWithUserDataRequest extends UserRequest {
  body: IUser;
}
