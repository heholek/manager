import angular from 'angular';
import 'angular-translate';
import 'ovh-ui-angular';
import ngOvhContracts from '@ovh-ux/ng-ovh-contracts';
import ngOvhPaymentMethod from '@ovh-ux/ng-ovh-payment-method';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';

import detachService from './services/product-offers-detach.service';
import service from './services/product-offers.service';

import component from './product-offers.component';
import constants from './product-offers.constants';

const moduleName = 'wucProductOffersModule';

angular
  .module(moduleName, [
    'oui',
    ngOvhContracts,
    ngOvhPaymentMethod,
    ngTranslateAsyncLoader,
    'pascalprecht.translate',
  ])
  .component('wucProductOffers', component)
  .constant('WUC_PRODUCT_OFFERS_CONSTANTS', constants)
  .service('WucProductOffersDetachService', detachService)
  .service('WucProductOffersService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
