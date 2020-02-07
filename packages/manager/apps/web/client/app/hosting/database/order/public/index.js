import angularTranslate from 'angular-translate';

import ovhManagerProductOffers from '@ovh-ux/manager-product-offers';

import component from './hosting-database-order-public.component';
import { state } from './hosting-database-order-public.routing';
import HostingDatabaseOrderPublic from './hosting-database-order-public.service';

const moduleName = 'ovhManagerHostingDatabaseOrderPublic';

angular
  .module(moduleName, [angularTranslate, ovhManagerProductOffers])
  .component(component.name, component)
  .service('HostingDatabaseOrderPublicService', HostingDatabaseOrderPublic)
  .config(
    /* @ngInject */ ($stateProvider) => {
      $stateProvider.state(state.name, state);
    },
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
