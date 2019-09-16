export default /* @ngInject */($stateProvider) => {
  $stateProvider.state('enterprise-cloud-database.service.details.restored-instances', {
    component: 'enterpriseCloudDatabaseServiceDetailsRestoredInstancesComponent',
    translations: {
      value: ['.'],
      format: 'json',
    },
    url: '/restored-instances',
    resolve: {
      endPoints: /* @ngInject */
        (clusterId, enterpriseCloudDatabaseService) => enterpriseCloudDatabaseService
          .getEndpointsWithDetails(clusterId),
      goBackToRestore: /* @ngInject */
        ($state, CucCloudMessage) => (message = false, type = 'success', clusterId = null) => {
          const reload = message && type === 'success';
          const state = 'enterprise-cloud-database.service.details.restored-instances';
          const promise = $state.go(state, {
            clusterId,
          },
          {
            reload,
          });
          if (message) {
            promise.then(() => {
              CucCloudMessage[type](message, state);
            });
          }
          return promise;
        },
      goToDelete: /* @ngInject */ $state => instanceId => $state.go('enterprise-cloud-database.service.details.restored-instances.delete', { instanceId }),
      restoredInstances: /* @ngInject */
        (clusterId, enterpriseCloudDatabaseService) => enterpriseCloudDatabaseService
          .getRestoreList(clusterId),
    },
  });
};
