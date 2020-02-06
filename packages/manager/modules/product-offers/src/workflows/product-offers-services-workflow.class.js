import Workflow from './product-offers-workflow.class';

/**
 * Workflow Class to handle service detachable options
 */
export default class ServicesWorkflow extends Workflow {
  /**
   * @param {Object} $translate      AngularJS provider
   * @param {Object} workflowOptions Specific options
   * for this workflow, must contains the following values:
   * - {serviceId}: Id of the service on which to detach an option
   * @param {Object} DetachService   Service to handle request to perform a
   * detach action, see /services API schema
   */
  constructor($q, $translate, workflowOptions, DetachService) {
    super($q, $translate, workflowOptions);
    this.workflowService = DetachService;

    if (!this.serviceId) {
      throw new Error(
        'ovhProductOffers - ServicesWorkflow: serviceId is undefined',
      );
    }
  }

  /**
   * Get the pricings from available detach plan codes.
   * Will tell to upper scope the loading state of the workflow
   * @return {Promise} Promise of detach pricings
   */
  getPricings() {
    this.updateLoadingStatus('getPricingInformation');

    return this.workflowService
      .getAvailableDetachPlancodes(this.serviceId)
      .then((plancodes) => {
        const [detachPlancode] = plancodes; // Yes, for the moment, there is just one plan code
        this.plancode = detachPlancode.planCode;
        this.pricings = this.computePricing(detachPlancode.pricings);

        if (this.hasUniquePricing()) {
          this.currentIndex += 1;
          [this.pricing] = this.pricings;
        }
      })
      .catch((error) =>
        !this.onError || this.onError({ error })
          ? this.$q.reject(error)
          : error,
      )
      .finally(() => {
        this.updateLoadingStatus('getPricingInformation');
      });
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
      duration: Workflow.formatDurationToISOString(pricing),
      pricingMode: pricing.mode,
      quantity: 1,
    };

    return this.workflowService
      .simulateDetachContract(
        this.planCode,
        this.serviceId,
        this.validationParameters,
      )
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
      .executeDetach(this.planCode, this.serviceId, this.validationParameters)
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
