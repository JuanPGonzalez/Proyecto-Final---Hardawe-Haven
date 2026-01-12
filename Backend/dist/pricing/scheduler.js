import { DynamicPricingService } from './dynamicPricing.js';
export function startPricingScheduler() {
    console.log('[Scheduler] Initializing Dynamic Pricing Scheduler...');
    // Run immediately on start? Requirements say "Every 30 minutes", implies interval. 
    // Often useful to verify it runs, but strictly "every 30 minutes" usually means wait.
    // I will stick to setInterval.
    const intervalMs = 30 * 60 * 1000;
    setInterval(async () => {
        console.log('[Scheduler] Triggering scheduled price adjustment...');
        await DynamicPricingService.adjustPrices();
    }, intervalMs);
    console.log(`[Scheduler] Pricing adjustment scheduled to run every ${intervalMs / 60000} minutes.`);
}
//# sourceMappingURL=scheduler.js.map