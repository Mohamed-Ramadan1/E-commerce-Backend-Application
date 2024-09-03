import express, { Application, NextFunction, Request, Response } from "express";
import path from "path";
import dotenv from "dotenv";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";

import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import shoppingCartRoutes from "./routes/shoppingCartRoutes";
import productRoutes from "./routes/productsRoutes";
import wishlistRoutes from "./routes/wishlistRoutes";
import checkoutRoutes from "./routes/checkoutRoutes";
import reviewRoutes from "./routes/reviewRoutes";
import ordersRoutes from "./routes/ordersRoutes";
import supportTicketsRoutes from "./routes/supportTicketsRoutes";
import returnProductsRoutes from "./routes/returnProductsRoutes";
import adminOrdersRoutes from "./routes/adminOrdersRoutes";
import refundRequestRoutes from "./routes/refundRequestsRoutes";
import shopRequestRoutes from "./routes/shopsRequestRoutes";
import shopsRoutes from "./routes/shopsRoutes";
import shopsManagementRoutes from "./routes/shopsManagementRoutes";
import deleteShopsRequestsRoutes from "./routes/deleteShopsRequestsRoutes";
import processedDeleteShopRequestRoutes from "./routes/processedDeleteShopRequestRoutes";
import ProcessedCreateShopRequestRoutes from "./routes/processedCreateShopsRequestsRoutes";
import processedRefundRequestsRoutes from "./routes/processedRefundRequestsRoutes";
import processedReturnProductsRoutes from "./routes/processedReturnProductsRequestsRoutes";
import processedSupportTicketsRoutes from "./routes/processedSupportTicketsRoutes";
import shopSupportTicketRoutes from "./routes/shopSupportTicketRoutes";
import shopsOrdersRoutes from "./routes/shopOrdersRoutes";
import notificationRoutes from "./routes/notificationRoutes";
import monthlyWebsiteAnalyticsReportRoutes from "./routes/monthlyWebsiteAnalyticsReportRoutes";
import monthlyShopeAnalyticsReportRoutes from "./routes/monthlyShopeAnalyticsReportRoutes";

import globalError from "./controllers/errorController";
import AppError from "./utils/ApplicationError";

const app: Application = express();

dotenv.config();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Set security HTTP headers
app.use(helmet());

// Enable CORS
app.use(cors({ origin: "http://localhost:5173" }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Data sanitization against NoSQL injection
app.use(mongoSanitize());

// Parse cookies
app.use(cookieParser());

// Body parser
app.use(express.json());

//serving static files
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/shopping-cart", shoppingCartRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/wishlist", wishlistRoutes);
app.use("/api/v1/checkout", checkoutRoutes);
app.use("/api/v1/reviews", reviewRoutes);
app.use("/api/v1/orders", ordersRoutes);
app.use("/api/v1/orders/admin", adminOrdersRoutes);
app.use("/api/v1/shop-orders", shopsOrdersRoutes);
app.use("/api/v1/notifications", notificationRoutes);

// the shop support ticket routes
app.use("/api/v1/shop-support-tickets", shopSupportTicketRoutes);

// support tickets routes
app.use("/api/v1/support-tickets", supportTicketsRoutes);

// the processed support tickets routes
app.use("/api/v1/processed-support-tickets", processedSupportTicketsRoutes);

// return products requests  routes
app.use("/api/v1/return-products", returnProductsRoutes);

// processed return products routes
app.use("/api/v1/processed-return-products", processedReturnProductsRoutes);

// the refund requests routes
app.use("/api/v1/refund-requests", refundRequestRoutes);

// the processed refund requests routes
app.use("/api/v1/processed-refund-requests", processedRefundRequestsRoutes);

app.use("/api/v1/shops-requests", shopRequestRoutes);
//router of the processed create shop requests
app.use("/api/v1/processed-shops-requests", ProcessedCreateShopRequestRoutes);
// this route related to the users (shops owners) operations on their shops.
app.use("/api/v1/shops", shopsRoutes);
// this route related to the admins operations on the shops.
app.use("/api/v1/admin/shops", shopsManagementRoutes);
// this route related to the admins operations on the shops delete requests.
app.use("/api/v1/delete-shops-requests", deleteShopsRequestsRoutes);
// this route related to the admins operations on the processed shops delete requests.
// router of the processed  shop deleted requests
app.use(
  "/api/v1/processed-delete-shops-requests",
  processedDeleteShopRequestRoutes
);

// this route related to the monthly website analytics report
app.use(
  "/api/v1/website-analytics/monthly-reports",
  monthlyWebsiteAnalyticsReportRoutes
);
// this route related to the monthly shops analytics report
app.use(
  "/api/v1/shop-analytics/monthly-reports",
  monthlyShopeAnalyticsReportRoutes
);

// Error handling middleware

app.use("*", (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalError);

export default app;
