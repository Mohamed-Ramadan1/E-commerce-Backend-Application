import cron from "node-cron";
import { createWebsiteAnalyticsReport } from "../../controllers/analytics/websiteAnalyticsReportController";

export const startWebsiteCronJobs = () => {
  // Run every minute
  cron.schedule(
    "0 0 1 * *",
    async () => {
      console.log("Running website analytics report generation");
      try {
        // Calculate date range for the last minute
        const now = new Date();
        const oneMinuteAgo = new Date(now.getTime() - 60000);

        console.log("Generating website analytics report");

        await createWebsiteAnalyticsReport(
          {
            query: {
              startDate: oneMinuteAgo.toISOString(),
              endDate: now.toISOString(),
            },
          } as any,
          null as any,
          (error: any) => {
            if (error) {
              console.error(
                "Error generating website analytics report:",
                error
              );
            } else {
              console.log(
                "Successfully generated and sent website analytics report"
              );
            }
          }
        );
      } catch (error) {
        console.error(
          "Error in cron job for generating website analytics report:",
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
