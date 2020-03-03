import 'script-loader!jquery'; // eslint-disable-line
import angular from 'angular';
import 'angular-translate';

import ovhManagerBanner from '@ovh-ux/manager-banner';
import ovhManagerHub from '@ovh-ux/manager-hub';

import component from './dashboard.component';

const moduleName = 'ovhManagerHubDashboard';

angular
  .module(moduleName, [
    'pascalprecht.translate',
    ovhManagerBanner,
    ovhManagerHub,
  ])
  .component('hubDashboard', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
