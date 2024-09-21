import cron from "node-cron";
import Shop from "../../models/shop/shopModal";
import { createShopAnalyticsReport } from "../../controllers/analytics/shopeAnalyticsReportController";

export const startCronJobs = () => {
  // Run at 12:00 AM on the 1st of every month
  cron.schedule(
    "0 0 1 * *",
    async () => {
      console.log(
        "Running monthly shop analytics report generation for all shops"
      );
      try {
        const shops = await Shop.find({});

        // Calculate date range for the previous month
        const now = new Date();
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const startOfLastMonth = new Date(
          lastMonth.getFullYear(),
          lastMonth.getMonth(),
          1
        );
        const endOfLastMonth = new Date(
          now.getFullYear(),
          now.getMonth(),
          0,
          23,
          59,
          59
        );

        for (const shop of shops) {
          try {
            console.log(`Generating report for shop: ${shop.shopName}`);

            await createShopAnalyticsReport(
              {
                params: { shopId: shop._id.toString() },
                query: {
                  startDate: startOfLastMonth.toISOString(),
                  endDate: endOfLastMonth.toISOString(),
                },
              } as any,
              null as any,
              (error: any) => {
                if (error) {
                  console.error(
                    `Error generating report for shop ${shop.shopName}:`,
                    error
                  );
                }
              }
            );

            console.log(
              `Finished generating report for shop: ${shop.shopName}`
            );
          } catch (shopError) {
            console.error(`Error processing shop ${shop.shopName}:`, shopError);
          }
        }

        console.log("Finished generating monthly reports for all shops");
      } catch (error) {
        console.error(
          "Error in cron job for generating monthly shop reports:",
          error
        );
      }
    },
    {
      scheduled: true,
      timezone: "UTC", // Adjust this to your preferred timezone
    }
  );
};
