import angular from 'angular';
import 'angular-translate';
import ngOvhTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';

import component from './information.component';

const moduleName = 'ovhManagerVpsDashboardTileInformation';

angular
  .module(moduleName, [ngOvhTranslateAsyncLoader, 'pascalprecht.translate'])
  .component('ovhManagerVpsDashboardTileInformation', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
