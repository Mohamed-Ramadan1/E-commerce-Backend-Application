import ReturnProduct from "../models/returnProductsModel";
import Order from "../models/orderModel";
import Product from "../models/productModel";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/ApplicationError";
import { IReturnRequest } from "../models/returnProducts.interface";
import { NextFunction, Request, Response } from "express";
import { ApiResponse } from "../shared-interfaces/response.interface";
import { sendResponse } from "../utils/sendResponse";
import {
  AuthUserRequest,
  ReturnItemsRequest,
} from "../shared-interfaces/request.interface";
