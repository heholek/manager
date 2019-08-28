import angular from 'angular';

import enterpriseCloudDatabaseServiceDetailsOverviewComponent from './overview.component';
import connectionDetails from '../../connection-details';
import routing from './overview.routing';
import updatePassword from './update-password';

const moduleName = 'ovhManagerEnterpriseCloudDatabaseServiceDetailsOverview';

angular
  .module(moduleName, [connectionDetails, updatePassword])
  .config(routing)
  .component('enterpriseCloudDatabaseServiceDetailsOverviewComponent', enterpriseCloudDatabaseServiceDetailsOverviewComponent)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
