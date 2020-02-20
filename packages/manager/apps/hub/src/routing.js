export default /* @ngInject */ ($stateProvider, $urlRouterProvider) => {
  $stateProvider.state('app', {
    url: '/',
    component: 'hubDashboard',
    resolve: {
      data: /* @ngInject */ (OvhApiHubService) =>
        OvhApiHubService.Aapi().query().$promise,
      services: /* @ngInject */ (data) => data.data.services.data.data,
    },
  });

  $urlRouterProvider.otherwise('/');
};
