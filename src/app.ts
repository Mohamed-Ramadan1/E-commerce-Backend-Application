import express, { Application, NextFunction, Request, Response } from "express";
import path from "path";
import dotenv from "dotenv";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";

import authRoutes from "./routes/auth/authRoutes";
import userRoutes from "./routes/users/userRoutes";
import shoppingCartRoutes from "./routes/shoppingCarts/shoppingCartRoutes";
import productRoutes from "./routes/products/productsRoutes";
import wishlistRoutes from "./routes/wishlist/wishlistRoutes";
import checkoutRoutes from "./routes/checkout/checkoutRoutes";
import reviewRoutes from "./routes/reviews/reviewRoutes";
import ordersRoutes from "./routes/orders/ordersRoutes";
import supportTicketsRoutes from "./routes/supportTickets/supportTicketsRoutes";
import returnProductsRoutes from "./routes/products/returnProductsRoutes";
import adminOrdersRoutes from "./routes/orders/adminOrdersRoutes";
import refundRequestRoutes from "./routes/refundRequests/refundRequestsRoutes";
import shopRequestRoutes from "./routes/shop/shopsRequestRoutes";
import shopsRoutes from "./routes/shop/shopsRoutes";
import shopsManagementRoutes from "./routes/shop/shopsManagementRoutes";
import deleteShopsRequestsRoutes from "./routes/shop/deleteShopsRequestsRoutes";
import processedDeleteShopRequestRoutes from "./routes/processedData/processedDeleteShopRequestRoutes";
import ProcessedCreateShopRequestRoutes from "./routes/processedData/processedCreateShopsRequestsRoutes";
import processedRefundRequestsRoutes from "./routes/processedData/processedRefundRequestsRoutes";
import processedReturnProductsRoutes from "./routes/processedData/processedReturnProductsRequestsRoutes";
import processedSupportTicketsRoutes from "./routes/processedData/processedSupportTicketsRoutes";
import shopSupportTicketRoutes from "./routes/supportTickets/shopSupportTicketRoutes";
import shopsOrdersRoutes from "./routes/orders/subOrdersRoutes";
import notificationRoutes from "./routes/notifications/notificationRoutes";
import monthlyWebsiteAnalyticsReportRoutes from "./routes/analytics/websiteAnalyticsReportRoutes";
import monthlyShopeAnalyticsReportRoutes from "./routes/analytics/shopeAnalyticsReportRoutes";
import primeSubscriptionRoutes from "./routes/primeMemberShip/primeSubscriptionRoutes";
import adminPrimeSubscriptionRoutes from "./routes/primeMemberShip/adminPrimeSubscriptionRoutes";
import discountCodeRoutes from "./routes/discountCode/discountCodeRoutes";
import shopDiscountCodeRoutes from "./routes/discountCode/shopDiscountCodeRoutes";
import websiteDiscountCodeRoutes from "./routes/discountCode/websiteDiscountCodeRoutes";
import messageRoutes from "./routes/messages/messageRoutes";
import reportShopRoutes from "./routes/reportShops/reportShopRoutes";

import globalError from "./controllers/error/errorController";
import AppError from "./utils/apiUtils/ApplicationError";

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
app.use("/api/v1/prime-subscription", primeSubscriptionRoutes);
app.use("/api/v1/admin/prime-subscription", adminPrimeSubscriptionRoutes);
app.use("/api/v1/discount-codes", discountCodeRoutes);
app.use("/api/v1/shop/discount-codes", shopDiscountCodeRoutes);
app.use("/api/v1/website/discount-codes", websiteDiscountCodeRoutes);
app.use("/api/v1/messages", messageRoutes);
app.use("/api/v1/report-shops", reportShopRoutes);

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
