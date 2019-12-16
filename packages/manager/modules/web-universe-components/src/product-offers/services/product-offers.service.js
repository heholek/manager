import { PRICING_CAPACITIES } from './product-offers.constants';

/**
 * Service to get specific pricings from a provided source
 * The source must provides pricings of the format: order.catalog.Pricing
 * (See /order API schema)
 */
export default class ProductOffersService {
  /**
   * Get the pricing with unique instllation capacity
   * @param  {Array}          pricings Pricings
   * @return {Pricing}                 Unique pricing with installation capacity
   */
  static getUniqueInstallationPricing(pricings) {
    return pricings.find(
      ({ capacities }) =>
        capacities.includes(PRICING_CAPACITIES.INSTALLATION) &&
        capacities.length === 1,
    );
  }

  /**
   * Filter pricings by a specified capacity
   * @param  {Array}          pricings Pricings source
   * @param  {string}         capacity Capacity on which to filter pricings
   * @return {Array<Pricing>}          List of filtered pricings
   */
  static filterPricingsByCapacity(pricings, capacity) {
    return pricings.filter(({ capacities }) => capacities.includes(capacity));
  }

  /**
   * Filter pricings by many capacities
   * @param  {Array}          pricings   Pricings source
   * @param  {Array<string>}  capacities Capacities list on which to filter
   * pricings
   * @return {Array<Pricing>}            List of filtered pricings
   */
  static filterPricingsByCapacities(pricings, capacities) {
    return capacities.map((capacity) =>
      ProductOffersService.filterPricingsByCapacity(pricings, capacity),
    );
  }
}
