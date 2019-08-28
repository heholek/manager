import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import 'ovh-ui-angular';

import component from './choose-cluster-config.component';

const moduleName = 'ovhManagerEnterpriseCloudDatabaseOrderChooseClusterConfigModule';

angular
  .module(moduleName, [
    'oui',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .component('enterpriseCloudDatabaseOrderChooseClusterConfig', component);

export default moduleName;
