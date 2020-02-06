import get from 'lodash/get';

import { ISO_DURATION_FORMAT } from './pricing.constants';

/** Class represeting a catalog Pricing.
 *  For class properties, see the order.catalog.public.Pricing[]
 *  in /order/catalog/public{/productName}
 */
export default class Pricing {
  /**
   * @param {Object} options  Class properties grouped.
   */
  constructor(options = {}) {
    Object.assign(this, options);
  }

  /**
   * Determines whether the pricing is free or not
   * @return {Boolean}
   */
  isFree() {
    return get(this, 'price') === 0;
  }

  /**
   * Get the ISO 8601 representation of the duration
   * @return {string} ISO8601 formatted duration
   */
  getDurationISOFormat() {
    const isoDurationFormat = this.intervalUnit.toUpperCase();
    const iso8601Unit = ISO_DURATION_FORMAT[isoDurationFormat];
    return moment.duration(this.interval, iso8601Unit).toISOString();
  }
}
