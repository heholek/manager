import {
  PRICING_CAPACITIES,
  WORKFLOW_TYPES,
} from '../../../../../../../../modules/product-offers/src/product-offers.constants';
import { CATALOG_ITEM_TYPE_NAMES } from '../../../../../../../../modules/product-offers/src/workflows/product-offers-workflow.constants';
import { PRODUCT_NAME } from './hosting-database-order-public.constants';

import HostingDatabaseOrderPublic from './hosting-database-order-public.service';

export default class {
  /* @ngInject */
  constructor(HostingDatabaseOrderPublicService) {
    this.HostingDatabaseOrderPublicService = HostingDatabaseOrderPublicService;
  }

  $onInit() {
    this.bindings = {
      characteristics: {
        isEditable: true,
        pricingCapacity: PRICING_CAPACITIES.RENEW,
        workflowType: WORKFLOW_TYPES.ORDER,
        workflowOptions: {
          catalog: this.catalog,
          catalogItemTypeName: CATALOG_ITEM_TYPE_NAMES.ADDON,
          productName: PRODUCT_NAME,
          serviceNameToAddProduct: this.serviceName,
          onBeforePricingGetPlancode: this.getPlancode.bind(this),
        },
        values: this.HostingDatabaseOrderPublicService.computeCharacteristics(
          this.characteristicsOfAvailableProducts,
        ),
      },
    };
  }

  getPlancode() {
    const {
      diskSpace,
      quantity,
    } = this.bindings.characteristics.value.characteristics;

    return HostingDatabaseOrderPublic.buildPlanCode(diskSpace, quantity);
  }

  getOrderState(state) {
    this.bindings.characteristics.isEditable = !state.isLoading;
  }
}
