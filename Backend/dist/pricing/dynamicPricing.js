import { Componente } from '../Model/componente.entity.js';
import { LineaCompra } from '../Model/lineaCompra.entity.js';
import { Precio } from '../Model/precio.entity.js';
export class DynamicPricingService {
    /**
     * Analyzes sales from the last 30 minutes and adjusts prices.
     * - Sales > 2: +10%
     * - Sales < 2: -10% (Min price > 0)
     */
    static async adjustPrices(em) {
        if (!em) {
            const { orm } = await import('../shared/db/orm.js');
            em = orm.em.fork();
        }
        console.log(`[DynamicPricing] Starting price adjustment analysis at ${new Date().toISOString()}`);
        try {
            // 1. Define time window (last 30 minutes)
            const now = new Date();
            const thirtyMinutesAgo = new Date(now.getTime() - 30 * 60 * 1000);
            // 2. Retrieve sales data
            // We need to check all sales that occurred in the last 30 minutes.
            // LineaCompra links to Compra, which has the date.
            const salesLines = await em.find(LineaCompra, {
                compra: {
                    fechaCompra: { $gte: thirtyMinutesAgo },
                },
            }, {
                populate: ['componente'],
            });
            // 3. Aggregate sales by Component ID
            // 3. Aggregate sales by Component ID
            const salesVolume = {};
            for (const line of salesLines) {
                // Assuming line.componente is loaded and has an ID or we can use the reference
                const compId = line.componente.id;
                if (compId !== undefined) {
                    salesVolume[compId] = (salesVolume[compId] || 0) + line.cantidad;
                }
            }
            // 4. Fetch ALL components to handle those with 0 sales
            // We need their current prices.
            const components = await em.find(Componente, {}, { populate: ['precios'] });
            let updatesCount = 0;
            for (const component of components) {
                if (component.id === undefined)
                    continue;
                const soldQuantity = salesVolume[component.id] || 0;
                // Find current price (most recent fechaDesde)
                const sortedPrices = component.precios.getItems().sort((a, b) => {
                    return new Date(b.fechaDesde).getTime() - new Date(a.fechaDesde).getTime();
                });
                const currentPriceEntity = sortedPrices[0];
                if (!currentPriceEntity) {
                    console.warn(`[DynamicPricing] Component ${component.name} (ID: ${component.id}) has no price. Skipping.`);
                    continue;
                }
                const currentPrice = Number(currentPriceEntity.valor);
                let newPriceVal = currentPrice;
                // Apply Business Rules
                if (soldQuantity > 2) {
                    // High sales: +10%
                    newPriceVal = currentPrice * 1.10;
                }
                else {
                    // Low sales (< 2, i.e., 0 or 1): -10%
                    newPriceVal = currentPrice * 0.90;
                }
                // Constraints
                // MAX adjustment is already 10% by definition of the math above.
                // Prevent zero or negative.
                if (newPriceVal <= 0) {
                    console.warn(`[DynamicPricing] Component ${component.name} calculated price <= 0. Clamping to 0.01 or keeping current.`);
                    // Requirement: "Must never be zero or negative."
                    // If strictly applying -10% leads to <=0, it implies current was <=0 which shouldn't happen,
                    // or very small. Let's clamp to a minimal positive value or keep it if it's already low?
                    // "Decrease its price by ten percent." -> limits to 0 asymptotically.
                    // But floating point math... simply ensure logic.
                    newPriceVal = Math.max(0.01, newPriceVal);
                }
                // Persist new price
                // We do not modify the old record (History tracking seems implied by 'fechaDesde' and OneToMany prices)
                // requirement: "Updates the product price in the database."
                // Given the structure, adding a new Precio entity is the way to "update" while keeping history.
                // Check if price actually changed to avoid spamming DB with identical prices if logic leads to same?
                // Requirement says "Every 30 minutes... Automatically adjust".
                // If sales < 2, it ALWAYS decreases. So it will change.
                // If sales > 2, it increases.
                // It seems it will always change unless sales exactly neutral? 
                // Rule: "High sales: > 2", "Low sales: < 2".
                // What if sales == 2?
                // Requirement: 
                // "High sales: more than two" (> 2)
                // "Low sales: fewer than two" (< 2)
                // Case == 2 is undefined in "Business Rules" text explicitly but "High" and "Low" definitions cover everything else?
                // "fewer than two sales (one or zero sales)".
                // So 2 is neither "more than two" nor "fewer than two"?
                // "Low sales: fewer than two sales (one or zero sales)" - This explicitly enumerates 1 and 0.
                // Logic gap: What about exactly 2?
                // I will assume if sales == 2, no change, or treat as low?
                // "High sales: more than two sales" -> > 2.
                // "Low sales: fewer than two sales" -> < 2.
                // If sales === 2, it falls in neither. I will leave price unchanged.
                if ((soldQuantity > 2 && newPriceVal !== currentPrice) || (soldQuantity < 2 && newPriceVal !== currentPrice)) {
                    const newPrecio = new Precio(new Date(), newPriceVal, component);
                    em.persist(newPrecio);
                    updatesCount++;
                }
            }
            await em.flush();
            console.log(`[DynamicPricing] Adjusted prices for ${updatesCount} components.`);
        }
        catch (error) {
            console.error('[DynamicPricing] Error adjusting prices:', error);
        }
    }
}
//# sourceMappingURL=dynamicPricing.js.map