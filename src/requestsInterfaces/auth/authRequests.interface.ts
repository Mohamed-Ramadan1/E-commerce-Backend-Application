import { Request } from "express";

export interface LoginRequest extends Request {
  body: {
    email: string;
    password: string;
  };
  headers: {
    authorization: string;
  };
}

export interface SingUpRequest extends Request {
  body: {
    name: string;
    email: string;
    phoneNumber: string;
    password: string;
    passwordConfirmation: string;
  };
}

export interface ForgotPasswordRequest extends Request {
  body: {
    email: string;
  };
}

export interface ResetPasswordRequest extends Request {
  body: {
    password: string;
    passwordConfirmation: string;
  };
  params: {
    token: string;
  };
}
