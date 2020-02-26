import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import ovhManagerCore from '@ovh-ux/manager-core';
import 'angular-translate';
import '@ovh-ux/ng-ovh-order-tracking';

import component from './component';

import './index.scss';

const moduleName = 'ovhManagerHubOrderTracking';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'oui',
    ovhManagerCore,
    'ngOvhOrderTracking',
    'pascalprecht.translate',
  ])
  .component('hubOrderTracking', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
