import 'script-loader!jquery'; // eslint-disable-line
import 'script-loader!moment/min/moment-with-locales.min.js'; //eslint-disable-line

import { Environment } from '@ovh-ux/manager-config';
import angular from 'angular';
import 'angular-translate';
import uiRouter from '@uirouter/angularjs';
import isString from 'lodash/isString';

import 'ovh-ui-angular';
import ovhManagerCore from '@ovh-ux/manager-core';
import ovhManagerHub from '@ovh-ux/manager-hub';
import ovhManagerNavbar from '@ovh-ux/manager-navbar';
import ovhManagerOrderTracking from '@ovh-ux/ng-ovh-order-tracking';

import head from 'lodash/head';

import atInternet from './components/at-internet';
import preload from './components/manager-preload';
import dashboard from './dashboard';

import controller from './controller';
import routing from './routing';
import './index.scss';
import 'ovh-ui-kit/dist/oui.css';

Environment.setRegion(__WEBPACK_REGION__);
Environment.setVersion(__VERSION__);

angular
  .module(
    'managerHubApp',
    [
      atInternet,
      dashboard,
      'pascalprecht.translate',
      'oui',
      ovhManagerCore,
      ovhManagerHub,
      ovhManagerNavbar,
      ovhManagerOrderTracking,
      preload,
      uiRouter,
      __NG_APP_INJECTIONS__,
    ].filter(isString),
  )
  .controller('HubController', controller)
  .config(
    /* @ngInject */ ($locationProvider) => $locationProvider.hashPrefix(''),
  )
  .config(routing)
  .run(
    /* @ngInject */ ($translate, $transitions) => {
      $transitions.onBefore({ to: 'app.**' }, () => $translate.refresh());
    },
  )
  .config(
    /* @ngInject */ (TranslateServiceProvider) => {
      const defaultLanguage = TranslateServiceProvider.getUserLocale();
      // set moment locale
      moment.locale(head(defaultLanguage.split('_')));
    },
  )
  .run(/* @ngTranslationsInject:json ./translations */);

