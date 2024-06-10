import { Response } from "express";

export const sendResponse = (
  statusCode: number,
  jsonResponse: object,
  res: Response
) => {
  return res.status(statusCode).json(jsonResponse);
};
