import createMailTransporter from "../../config/mailTransporter.config";
import { IShop } from "models/shop/shop.interface";
import { IShopAnalyticsReport } from "../../models/analytics/shopeAnalyticsReport.interface";

const sendShopReportEmail = (shop: IShop, shopReport: IShopAnalyticsReport) => {
  const transport = createMailTransporter();
  const mailOptions = {
    from: "E-commerce Application <azaz123456az4@gmail.com>",
    to: shopReport.shopEmail,
    subject: `Shop Analytics Report - ${shopReport.month} ${shopReport.year}`,
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Shop Analytics Report</title>
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
            <h1>Shop Analytics Report</h1>
        </div>
        <div class="content">
            <div class="section">
                <h2>Shop Information</h2>
                <table>
                    <tr>
                        <th>Shop Name</th>
                        <td>${shopReport.shopName}</td>
                    </tr>
                    <tr>
                        <th>Report Period</th>
                        <td>${shopReport.month} ${shopReport.year}</td>
                    </tr>
                </table>
            </div>
            <div class="section">
                <h2>Financial Overview</h2>
                <table>
                    <tr>
                        <th>Metric</th>
                        <th>Amount</th>
                    </tr>
                    <tr>
                        <td>Total Revenue</td>
                        <td>$${shopReport.financialInformation.totalRevenue.toFixed(
                          2
                        )}</td>
                    </tr>
                    <tr>
                        <td>Total Refund</td>
                        <td>$${shopReport.financialInformation.totalRefund.toFixed(
                          2
                        )}</td>
                    </tr>
                    <tr>
                        <td>Average Order Value</td>
                        <td>$${shopReport.financialInformation.averageOrderValue.toFixed(
                          2
                        )}</td>
                    </tr>
                    <tr class="highlight">
                        <td><strong>Total Profit</strong></td>
                        <td><strong>$${shopReport.financialInformation.totalProfit.toFixed(
                          2
                        )}</strong></td>
                    </tr>
                </table>
            </div>
            <div class="section">
                <h2>Order Statistics</h2>
                <table>
                    <tr>
                        <th>Status</th>
                        <th>Count</th>
                    </tr>
                    <tr>
                        <td>Total Orders</td>
                        <td>${shopReport.orders.totalOrders}</td>
                    </tr>
                    <tr>
                        <td>Shipped Orders</td>
                        <td>${shopReport.orders.totalShippedOrders}</td>
                    </tr>
                    <tr>
                        <td>Delivered Orders</td>
                        <td>${shopReport.orders.totalDeliveredOrders}</td>
                    </tr>
                    <tr>
                        <td>Cancelled Orders</td>
                        <td>${shopReport.orders.totalCancelledOrders}</td>
                    </tr>
                    <tr>
                        <td>Pending Orders</td>
                        <td>${shopReport.orders.totalPendingOrders}</td>
                    </tr>
                </table>
            </div>
            <div class="section">
                <h2>Return and Refund Information</h2>
                <table>
                    <tr>
                        <th>Metric</th>
                        <th>Count</th>
                    </tr>
                    <tr>
                        <td>Total Return Items</td>
                        <td>${
                          shopReport.returnInformation.totalReturnItems
                        }</td>
                    </tr>
                    <tr>
                        <td>Accepted Return Items</td>
                        <td>${
                          shopReport.returnInformation.totalAcceptedReturnItems
                        }</td>
                    </tr>
                    <tr>
                        <td>Rejected Return Items</td>
                        <td>${
                          shopReport.returnInformation.totalRejectedReturnItems
                        }</td>
                    </tr>
                    <tr>
                        <td>Total Refund Requests</td>
                        <td>${
                          shopReport.refundInformation.totalRefundRequests
                        }</td>
                    </tr>
                    <tr>
                        <td>Accepted Refund Requests</td>
                        <td>${
                          shopReport.refundInformation
                            .totalAcceptedRefundRequests
                        }</td>
                    </tr>
                    <tr>
                        <td>Rejected Refund Requests</td>
                        <td>${
                          shopReport.refundInformation
                            .totalRejectedRefundRequests
                        }</td>
                    </tr>
                </table>
            </div>
            <div class="section">
                <h2>Product Information</h2>
                <table>
                    <tr>
                        <th>Metric</th>
                        <th>Count</th>
                    </tr>
                    <tr>
                        <td>Total Products</td>
                        <td>${shopReport.productInformation.totalProducts}</td>
                    </tr>
                    <tr>
                        <td>Active Products</td>
                        <td>${
                          shopReport.productInformation.totalActiveProducts
                        }</td>
                    </tr>
                    <tr>
                        <td>Inactive Products</td>
                        <td>${
                          shopReport.productInformation.totalInactiveProducts
                        }</td>
                    </tr>
                    <tr>
                        <td>Out of Stock Products</td>
                        <td>${
                          shopReport.productInformation.totalOutOfStockProducts
                        }</td>
                    </tr>
                    <tr>
                        <td>In Stock Products</td>
                        <td>${
                          shopReport.productInformation.totalInStockProducts
                        }</td>
                    </tr>
                    <tr>
                        <td>Freezed Products</td>
                        <td>${
                          shopReport.productInformation.totalFreezedProducts
                        }</td>
                    </tr>
                    <tr>
                        <td>Unfreezed Products</td>
                        <td>${
                          shopReport.productInformation.totalUnFreezedProducts
                        }</td>
                    </tr>
                    <tr>
                        <td>New Products</td>
                        <td>${shopReport.productInformation.newProducts}</td>
                    </tr>
                </table>
            </div>
        </div>
        <div class="footer">
            <p>This is an automated report for ${shopReport.shopName}.</p>
        </div>
    </div>
</body>
</html>
    `,
  };

  transport.sendMail(mailOptions, (err: Error | null, info: any) => {
    if (err) {
      console.log(err.message);
    } else {
      console.log("Shop analytics report email sent successfully.");
    }
  });
};

export default sendShopReportEmail;
