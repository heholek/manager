import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import some from 'lodash/some';
import sortBy from 'lodash/sortBy';

import Pricing from '../pricing/pricing.class';
import ProductOffersService from '../services/product-offers.service';
import { PRICING_CAPACITIES } from '../product-offers.constants';

/**
 * Workflow base class
 * Each type of workflow (see WORKFLOW_TYPES), inherits this abstract class
 * @abstract
 */
export default class Workflow {
  /**
   * @param {Object} $translate      AngularJS provider
   * @param {Object} workflowOptions Workflow specific options. Each type of
   * workflow has its own options to work with.
   * See other workflow class constructor documentation for more details.
   */
  constructor($q, $translate, workflowOptions) {
    this.$q = $q;
    this.$translate = $translate;

    if (new.target === Workflow) {
      throw new TypeError(
        'ovhProductOffers-Workflow: Workflow cannot be instanciated directly',
      );
    }

    if (!workflowOptions) {
      throw new Error(
        'ovhProductOffers-Workflow: workflowOptions is undefined',
      );
    }

    Object.assign(this, workflowOptions);

    this.currentIndex = 0;

    this.loading = {
      getPricingInformation: false,
      getOfferValidationInformation: false,
      validateOffer: false,
    };
  }

  /**
   * Determines if the selected pricing is free
   * @return {boolean}
   */
  isFreePricing() {
    return this.pricing && this.pricing.isFree();
  }

  /**
   * Determines if the offer has a unique pricing to use
   * @return {boolean}
   */
  hasUniquePricing() {
    return this.pricings && this.pricings.length === 1;
  }

  /**
   * Return an object which determines the workflow loading state
   * @return {Object} Object representing thr state
   */
  getCurrentState() {
    return {
      isLoading: this.isLoading(),
    };
  }

  /**
   * Update the loading status, based on a action loading name, and call the
   * method to update upper scope
   * @param  {string} loadingKey Action loading name
   */
  updateLoadingStatus(loadingKey) {
    this.loading[loadingKey] = !this.loading[loadingKey];
    this.sendCurrentState({ state: this.getCurrentState() });
  }

  /**
   * Determines if the workflow is currently loading
   * @return {boolean}
   */
  isLoading() {
    return some(Object.values(this.loading), (value) => value);
  }

  /**
   * Compute pricings, based on the pricing type.
   * @param  {Array} pricingsToCompute Pricings of the option to order.
   * @return {Array<Pricing>}          List of computed pricings,
   * sorted by price.
   */
  computePricing(pricingsToCompute) {
    const pricingsOfType = ProductOffersService.filterPricingsByCapacity(
      pricingsToCompute,
      this.pricingType,
    );

    let pricings = pricingsOfType;

    if (this.pricingType === PRICING_CAPACITIES.RENEW) {
      const pricingWithOnlyInstallationCapacity = ProductOffersService.getUniqueInstallationPricing(
        pricingsToCompute,
      );
      const pricingsWithOnlyRenewCapacity = pricingsOfType.filter(
        ({ capacities }) => isEqual(capacities, [PRICING_CAPACITIES.RENEW]),
      );
      const pricingsWitRenewAndInstallationCapacities = pricingsOfType.filter(
        ({ capacities }) =>
          isEqual(capacities.sort(), [
            PRICING_CAPACITIES.INSTALLATION,
            PRICING_CAPACITIES.RENEW,
          ]),
      );

      if (
        !pricingsWitRenewAndInstallationCapacities &&
        !pricingWithOnlyInstallationCapacity &&
        pricingsWithOnlyRenewCapacity
      ) {
        throw new Error(
          'ovhProductOffers-OrderWorkflow: No installation pricing found',
        );
      }

      pricings = pricingsWithOnlyRenewCapacity
        .map((pricing) => ({
          ...pricing,
          price:
            pricing.price +
            get(pricingWithOnlyInstallationCapacity, 'price', 0),
          tax: pricing.tax + get(pricingWithOnlyInstallationCapacity, 'tax', 0),
        }))
        .concat(pricingsWitRenewAndInstallationCapacities);
    }

    return sortBy(
      pricings.map((pricing) => Workflow.convertPricingObject(pricing)),
      'price',
    );
  }

  /**
   * Convert pricing object to new Pricing class instance
   * @param  {Object} pricing Pricing to transform
   * @return {Pricing}        Instance of Pricing
   */
  static convertPricingObject(pricing) {
    return new Pricing(pricing);
  }
}
