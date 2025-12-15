import cron from "node-cron";
import { expirePremiumSubscriptions } from "./premiumLimitService.js";

// Run every day at midnight to check for expired subscriptions
export const startSubscriptionExpiryJob = () => {
  cron.schedule("0 0 * * *", async () => {
    console.log("Running premium subscription expiry check...");
    try {
      await expirePremiumSubscriptions();
    } catch (error) {
      console.error("Error in subscription expiry job:", error);
    }
  });

  console.log("Subscription expiry cron job started - runs daily at midnight");
};

// Run every hour to check for expired subscriptions (more frequent)
export const startHourlyExpiryCheck = () => {
  cron.schedule("0 * * * *", async () => {
    try {
      await expirePremiumSubscriptions();
    } catch (error) {
      console.error("Error in hourly expiry check:", error);
    }
  });

  console.log("Hourly subscription expiry check started");
};
