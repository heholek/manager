import OrderWorkflow from './workflows/product-offers-order-workflow.class';
import ServicesWorkflow from './workflows/product-offers-services-workflow.class';

import DetachService from './services/product-offers-detach.service';

import { WORKFLOW_TYPES } from './product-offers.constants';

export default class ProductOffersController {
  /* @ngInject */
  constructor($q, $translate, WucOrderCartService) {
    this.$q = $q;
    this.$translate = $translate;
    this.WucOrderCartService = WucOrderCartService;
  }

  $onInit() {
    if (!this.workflowType) {
      throw new Error('ovhProductOffersComponent: workflowType is undefined');
    }

    if (!this.workflowOptions) {
      throw new Error(
        'ovhProductOffersComponent: workflowOptions is undefined',
      );
    }

    switch (this.workflowType) {
      case WORKFLOW_TYPES.ORDER:
        this.workflow = new OrderWorkflow(
          this.$q,
          this.$translate,
          this.workflowOptions,
          this.WucOrderCartService,
        );
        break;
      case WORKFLOW_TYPES.SERVICES:
        this.workflow = new ServicesWorkflow(
          this.$q,
          this.$translate,
          this.workflowOptions,
          DetachService,
        );
        break;
      default:
        break;
    }

    Object.assign(this.workflow, {
      pricingType: this.pricingType,
      sendCurrentState: this.sendCurrentState,
      user: this.user,
      onError: this.onError,
      onSuccess: this.onSuccess,
    });
  }
}
