import createMailTransporter from "../../config/mailTransporter.config";
import { IWebsiteAnalyticsReport } from "../../models/analytics/websiteAnalyticsReport.interface";

const sendWebsiteAnalyticsReportEmail = (
  report: IWebsiteAnalyticsReport,
  recipientEmail: string
) => {
  const transport = createMailTransporter();
  const mailOptions = {
    from: "E-commerce Application <azaz123456az4@gmail.com>",
    to: recipientEmail,
    subject: `Website Analytics Report - ${report.month} ${report.year}`,
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Website Analytics Report</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 800px;
            margin: 20px auto;
            background: #fff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        .header {
            background-color: #4a90e2;
            color: #ffffff;
            padding: 20px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
        }
        .content {
            padding: 20px;
        }
        .section {
            margin-bottom: 20px;
        }
        .section h2 {
            color: #4a90e2;
            font-size: 20px;
            border-bottom: 2px solid #4a90e2;
            padding-bottom: 5px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
        th {
            background-color: #f2f2f2;
            font-weight: bold;
        }
        .highlight {
            background-color: #e6f3ff;
        }
        .footer {
            background-color: #f8f8f8;
            padding: 10px 20px;
            text-align: center;
            font-size: 12px;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Website Analytics Report</h1>
        </div>
        <div class="content">
            <div class="section">
                <h2>Report Information</h2>
                <table>
                    <tr>
                        <th>Report Period</th>
                        <td>${report.month} ${report.year}</td>
                    </tr>
                </table>
            </div>
            
            <div class="section">
                <h2>Financial Summary (Last 30 Days)</h2>
                <table>
                    <tr>
                        <th>Metric</th>
                        <th>Amount</th>
                    </tr>
                    <tr>
                        <td>Total Sales</td>
                        <td>$${report.financialSummary.totalSales.toFixed(
                          2
                        )}</td>
                    </tr>
                    <tr>
                        <td>Total Shop Sales</td>
                        <td>$${report.financialSummary.totalShopSales.toFixed(
                          2
                        )}</td>
                    </tr>
                    <tr>
                        <td>Total Website Sales</td>
                        <td>$${report.financialSummary.totalWebsiteSales.toFixed(
                          2
                        )}</td>
                    </tr>
                    <tr>
                        <td>Total Processed Refunds</td>
                        <td>$${report.financialSummary.totalProcessedRefunds.toFixed(
                          2
                        )}</td>
                    </tr>
                    <tr class="highlight">
                        <td><strong>Total Website Profit</strong></td>
                        <td><strong>$${report.financialSummary.totalWebsiteProfit.toFixed(
                          2
                        )}</strong></td>
                    </tr>
                    <tr>
                        <td>Average Order Value</td>
                        <td>$${report.financialSummary.averageOrderValue.toFixed(
                          2
                        )}</td>
                    </tr>
                </table>
            </div>

            <div class="section">
                <h2>Shop Analytics</h2>
                <table>
                    <tr>
                        <th>Metric</th>
                        <th>Count</th>
                    </tr>
                    <tr>
                        <td>Total Shops</td>
                        <td>${report.shopAnalytics.totalShops}</td>
                    </tr>
                    <tr>
                        <td>Active Shops</td>
                        <td>${report.shopAnalytics.activeShops}</td>
                    </tr>
                    <tr>
                        <td>Inactive Shops</td>
                        <td>${report.shopAnalytics.inactiveShops}</td>
                    </tr>
                    <tr>
                        <td>Shops with Products</td>
                        <td>${report.shopAnalytics.shopsWithProducts}</td>
                    </tr>
                    <tr>
                        <td>New Joining Shops</td>
                        <td>${report.shopAnalytics.newJoiningShops}</td>
                    </tr>
                    <tr>
                        <td>Shops with Orders</td>
                        <td>${report.shopAnalytics.shopsWithOrders}</td>
                    </tr>
                    <tr>
                        <td>Shops Support Tickets</td>
                        <td>${report.shopAnalytics.shopsSupportTickets}</td>
                    </tr>
                    <tr>
                        <td>New Shop Requests</td>
                        <td>${report.shopAnalytics.newShopsRequests}</td>
                    </tr>
                    <tr>
                        <td>New Delete Shop Requests</td>
                        <td>${report.shopAnalytics.newDeleteShopsRequests}</td>
                    </tr>
                </table>
            </div>

            <div class="section">
                <h2>Order Analytics</h2>
                <table>
                    <tr>
                        <th>Metric</th>
                        <th>Count</th>
                    </tr>
                    <tr>
                        <td>Total Orders</td>
                        <td>${report.orderAnalytics.totalOrders}</td>
                    </tr>
                    <tr>
                        <td>Total Shop Orders</td>
                        <td>${report.orderAnalytics.totalShopOrders}</td>
                    </tr>
                    <tr>
                        <td>Total Website Orders</td>
                        <td>${report.orderAnalytics.totalWebsiteOrders}</td>
                    </tr>
                    <tr>
                        <td>Total Pending Orders</td>
                        <td>${report.orderAnalytics.totalPendingOrders}</td>
                    </tr>
                    <tr>
                        <td>Total Cancelled Orders</td>
                        <td>${report.orderAnalytics.totalCancelledOrders}</td>
                    </tr>
                    <tr>
                        <td>Total Delivered Orders</td>
                        <td>${report.orderAnalytics.totalDeliveredOrders}</td>
                    </tr>
                    <tr>
                        <td>Total Return Items</td>
                        <td>${report.orderAnalytics.totalReturnItems}</td>
                    </tr>
                </table>
            </div>

            <div class="section">
                <h2>Product Analytics</h2>
                <table>
                    <tr>
                        <th>Metric</th>
                        <th>Count</th>
                    </tr>
                    <tr>
                        <td>Total Products</td>
                        <td>${report.productAnalytics.totalProducts}</td>
                    </tr>
                    <tr>
                        <td>Total Shop Products</td>
                        <td>${report.productAnalytics.totalShopProducts}</td>
                    </tr>
                    <tr>
                        <td>Total Website Products</td>
                        <td>${report.productAnalytics.totalWebsiteProducts}</td>
                    </tr>
                    <tr>
                        <td>New Products</td>
                        <td>${report.productAnalytics.newProducts}</td>
                    </tr>
                    <tr>
                        <td>Total Out of Stock Products</td>
                        <td>${
                          report.productAnalytics.totalOutOfStockProducts
                        }</td>
                    </tr>
                    <tr>
                        <td>Total In Stock Products</td>
                        <td>${report.productAnalytics.totalInStockProducts}</td>
                    </tr>
                </table>
            </div>

            <div class="section">
                <h2>User Analytics</h2>
                <table>
                    <tr>
                        <th>Metric</th>
                        <th>Count</th>
                    </tr>
                    <tr>
                        <td>Total Users</td>
                        <td>${report.userAnalytics.totalUsers}</td>
                    </tr>
                    <tr>
                        <td>Total Shop Owners</td>
                        <td>${report.userAnalytics.totalShopOwners}</td>
                    </tr>
                    <tr>
                        <td>New Users</td>
                        <td>${report.userAnalytics.newUsers}</td>
                    </tr>
                    <tr>
                        <td>Users with Orders</td>
                        <td>${report.userAnalytics.usersWithOrders}</td>
                    </tr>
                    <tr>
                        <td>Users with No Orders</td>
                        <td>${report.userAnalytics.usersWithNoOrders}</td>
                    </tr>
                </table>
            </div>

            <div class="section">
                <h2>Refund Analytics</h2>
                <table>
                    <tr>
                        <th>Metric</th>
                        <th>Count</th>
                    </tr>
                    <tr>
                        <td>Total Refund Requests</td>
                        <td>${report.refundAnalytics.totalRefundRequests}</td>
                    </tr>
                    <tr>
                        <td>Total Processed Refund Requests</td>
                        <td>${
                          report.refundAnalytics.totalProcessedRefundRequests
                        }</td>
                    </tr>
                    <tr>
                        <td>New Refund Requests</td>
                        <td>${report.refundAnalytics.newRefundRequests}</td>
                    </tr>
                    <tr>
                        <td>Total Refund Requests for Cancelled Orders</td>
                        <td>${
                          report.refundAnalytics
                            .totalRefundRequestsForCancelledOrders
                        }</td>
                    </tr>
                    <tr>
                        <td>Total Refund Requests for Return Items</td>
                        <td>${
                          report.refundAnalytics
                            .totalRefundRequestsForReturnItems
                        }</td>
                    </tr>
                    <tr>
                        <td>Rejected Refund Requests</td>
                        <td>${
                          report.refundAnalytics.rejectedRefundRequests
                        }</td>
                    </tr>
                </table>
            </div>

            <div class="section">
                <h2>Return Items Analytics</h2>
                <table>
                    <tr>
                        <th>Metric</th>
                        <th>Count</th>
                    </tr>
                    <tr>
                        <td>Total Return Items Requests</td>
                        <td>${
                          report.returnItemsAnalytics.totalReturnItemsRequests
                        }</td>
                    </tr>
                    <tr>
                        <td>Total Processed Return Items Requests</td>
                        <td>${
                          report.returnItemsAnalytics
                            .totalProcessedReturnItemsRequests
                        }</td>
                    </tr>
                    <tr>
                        <td>New Return Items Requests</td>
                        <td>${
                          report.returnItemsAnalytics.newReturnItemsRequests
                        }</td>
                    </tr>
                    <tr>
                        <td>Total Rejected Return Items Requests</td>
                        <td>${
                          report.returnItemsAnalytics
                            .totalRejectedReturnItemsRequests
                        }</td>
                    </tr>
                    <tr>
                        <td>Total Cancelled Return Items Requests</td>
                        <td>${
                          report.returnItemsAnalytics
                            .totalCancelledReturnItemsRequests
                        }</td>
                    </tr>
                </table>
            </div>

            <div class="section">
                <h2>Support Ticket Analytics</h2>
                <table>
                    <tr>
                        <th>Metric</th>
                        <th>Count</th>
                    </tr>
                    <tr>
                        <td>Total Users Support Tickets</td>
                        <td>${
                          report.supportTicketAnalytics.totalUsersSupportTickets
                        }</td>
                    </tr>
                    <tr>
                        <td>Total Processed Support Tickets</td>
                        <td>${
                          report.supportTicketAnalytics
                            .totalProcessedSupportTickets
                        }</td>
                    </tr>
                    <tr>
                        <td>New User Support Tickets</td>
                        <td>${
                          report.supportTicketAnalytics.newUserSupportTickets
                        }</td>
                    </tr>
                    <tr>
                        <td>Total Shop Support Tickets</td>
                        <td>${
                          report.supportTicketAnalytics.totalShopSupportTickets
                        }</td>
                    </tr>
                    <tr>
                        <td>Total Processed Shop Support Tickets</td>
                        <td>${
                          report.supportTicketAnalytics
                            .totalProcessedShopSupportTickets
                        }</td>
                    </tr>
                    <tr>
                        <td>New Shop Support Tickets</td>
                        <td>${
                          report.supportTicketAnalytics.newShopSupportTickets
                        }</td>
                    </tr>
                </table>
            </div>

            <div class="section">
                <h2>Prime Subscription Analytics</h2>
                <table>
                    <tr>
                        <th>Metric</th>
                        <th>Count</th>
                    </tr>
                    <tr>
                        <td>Total Prime Subscriptions</td>
                        <td>${
                          report.primeSubscriptionAnalytics
                            .totalPrimeSubscriptions
                        }<tr>
                        <td>New Prime Subscriptions</td>
                        <td>${
                          report.primeSubscriptionAnalytics
                            .newPrimeSubscriptions
                        }</td>
                    </tr>
                    <tr>
                        <td>Total Active Prime Subscriptions</td>
                        <td>${
                          report.primeSubscriptionAnalytics
                            .totalActivePrimeSubscriptions
                        }</td>
                    </tr>
                    <tr>
                        <td>Total Inactive Prime Subscriptions</td>
                        <td>${
                          report.primeSubscriptionAnalytics
                            .totalInactivePrimeSubscriptions
                        }</td>
                    </tr>
                </table>
            </div>
        </div>
        <div class="footer">
            <p>This is an automated report generated on ${new Date().toLocaleString()}. For any questions or concerns, please contact our support team.</p>
        </div>
    </div>
</body>
</html>
    `,
  };

  transport.sendMail(mailOptions, (err: Error | null, info: any) => {
    if (err) {
      console.log("Error sending website analytics report email:", err.message);
    } else {
      console.log("Website analytics report email sent successfully.");
    }
  });
};

export default sendWebsiteAnalyticsReportEmail;
