import { Secret, sign } from "jsonwebtoken";
import { Response } from "express";
import { IUser } from "../models/user.interface";
export const createSendToken = (
  user: IUser,
  statusCode: number,
  res: Response
) => {
  const token: string = sign(
    { id: user._id },
    process.env.JWT_SECRET as Secret,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );

  const cookieOptions: object = {
    expires: new Date(
      Date.now() +
        parseInt(process.env.JWT_COOKIE_EXPIRES_IN || "0") * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  // Set the JWT token as a cookie
  res.cookie("jwt", token, cookieOptions);

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

export const createLogOutToken = (
  user: IUser,
  statusCode: number,
  res: Response
) => {
  const token: string = sign(
    { id: user._id },
    process.env.JWT_SECRET as Secret,
    {
      expiresIn: 1,
    }
  );

  res.cookie("jwt", "", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(statusCode).json({
    status: "success",
    token,
  });
};
