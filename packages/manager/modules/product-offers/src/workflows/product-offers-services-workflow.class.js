import Workflow from './product-offers-workflow.class';

/**
 * Workflow Class to handle service detachable options
 */
export default class ServicesWorkflow extends Workflow {
  /**
   * @param {Object} $q              AngularJS provider
   * @param {Object} $translate      AngularJS provider
   * @param {Object} workflowOptions Specific options
   * for this workflow, must contains the following values:
   * - {serviceId}: Id of the service on which to detach an option
   * - {detachPlancode}: Item representing the option to detach
   * @param {Object} DetachService   Service to handle request to perform a
   * detach action, see /services API schema
   */
  constructor($q, $translate, workflowOptions, detachService) {
    super($q, $translate, workflowOptions);
    this.workflowService = detachService;

    if (!this.serviceId) {
      throw new Error(
        'ovhProductOffers - ServicesWorkflow: serviceId is undefined',
      );
    }
  }

  /**
   * Get the pricings from available detach plan codes,
   * based on the pricing type
   */
  getPricings() {
    const [detachPlancode] = this.detachPlancodes; // Yes, for the moment, there is just one plan code
    this.plancode = detachPlancode.planCode;
    this.pricings = this.computePricing(detachPlancode.prices);

    if (this.hasUniquePricing()) {
      this.currentIndex += 1;
      [this.pricing] = this.pricings;
    }
  }

  /**
   * Get the information for detach validation
   * Will tell to upper scope the loading state of the workflow
   * @return {Promise}
   */
  getValidationInformation() {
    this.updateLoadingStatus('getOfferValidationInformation');

    const pricing = this.pricing || this.pricings[0];
    this.validationParameters = {
      duration: pricing.getDurationISOFormat(),
      pricingMode: pricing.mode,
      quantity: 1,
    };

    return this.workflowService
      .simulateDetach(this.plancode, this.serviceId, this.validationParameters)
      .then(({ contracts, prices }) => {
        this.contracts = contracts;
        this.prices = prices;
      })
      .catch((error) =>
        !this.onError || this.onError({ error })
          ? this.$q.reject(error)
          : error,
      )
      .finally(() => {
        this.updateLoadingStatus('getOfferValidationInformation');
      });
  }

  /**
   * Validate the detach offer
   * Will tell to upper scope the loading state of the workflow
   * @return {Promise} Promise of the validated detach offer
   */
  validateOffer() {
    this.updateLoadingStatus('validateOffer');

    const autoPayWithPreferredPaymentMethod = !!this.defaultPaymentMethod;
    let detachResult;

    this.validationParameters.autoPayWithPreferredPaymentMethod = autoPayWithPreferredPaymentMethod;

    return this.workflowService
      .executeDetach(this.plancode, this.serviceId, this.validationParameters)
      .then((_detachResult) => {
        detachResult = _detachResult;

        return this.workflowService.payDetach(
          detachResult.orderId,
          this.defaultPaymentMethod,
        );
      })
      .then(() => {
        this.onSuccess({
          detachResult: {
            ...detachResult,
            autoPayWithPreferredPaymentMethod,
          },
        });
      })
      .catch((error) =>
        !this.onError || this.onError({ error })
          ? this.$q.reject(error)
          : error,
      )
      .finally(() => {
        this.updateLoadingStatus('validateOffer');
      });
  }
}
