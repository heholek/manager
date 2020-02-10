import angular from 'angular';
import 'angular-translate';
import 'ovh-ui-angular';
import ngOvhContracts from '@ovh-ux/ng-ovh-contracts';
import ngOvhPaymentMethod from '@ovh-ux/ng-ovh-payment-method';
import ngOvhWebUniverseComponents from '@ovh-ux/ng-ovh-web-universe-components';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';

import detachService from './services/product-offers-detach.service';
import service from './services/product-offers.service';

import component from './product-offers.component';
import constants from './product-offers.constants';
import pricingConstants from './pricing/pricing.constants';

const moduleName = 'ovhManagerProductOffers';

angular
  .module(moduleName, [
    'oui',
    ngOvhContracts,
    ngOvhPaymentMethod,
    ngOvhWebUniverseComponents,
    ngTranslateAsyncLoader,
    'pascalprecht.translate',
  ])
  .component('ovhManagerProductOffers', component)
  .constant('OVH_MANAGER_PRODUCT_OFFERS_CONSTANTS', constants)
  .constant('OVH_MANAGER_PRODUCT_OFFERS_PRICING_CONSTANTS', pricingConstants)
  .service('ovhManagerProductOffersDetachService', detachService)
  .service('ovhManagerProductOffersService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
