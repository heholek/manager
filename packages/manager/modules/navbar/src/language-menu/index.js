import angular from 'angular';
import 'angular-translate';

import '@ovh-ux/manager-core';

import menuHeader from '../navbar-menu-header';

import component from './component';

const moduleName = 'ovhManagerNavbarLanguageMenu';

angular
  .module(moduleName, ['ovhManagerCore', 'pascalprecht.translate', menuHeader])
  .component('ovhManagerNavbarLanguageMenu', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
