import controller from './hosting.controller';
import template from './hosting.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.hosting', {
    url: '/configuration/hosting/:productId?tab',
    template,
    controller,
    controllerAs: '$ctrl',
    reloadOnSearch: false,
    params: {
      tab: null,
    },
    resolve: {
      serviceName: /* @ngInject */ ($transition$) =>
        $transition$.params().productId,
      goToHosting: /* @ngInject */ ($state, $timeout, Alerter) => (
        message = false,
        type = 'success',
      ) => {
        const promise = $state.go('app.hosting', {});

        if (message) {
          promise.then(() =>
            $timeout(() =>
              Alerter.set(`alert-${type}`, message, null, 'app.alerts.main'),
            ),
          );
        }

        return promise;
      },
      navigationInformations: /* @ngInject */ (Navigator, $rootScope) => {
        // eslint-disable-next-line no-param-reassign
        $rootScope.currentSectionInformation = 'hosting';
        return Navigator.setNavigationInformation({
          leftMenuVisible: true,
          configurationSelected: true,
        });
      },
      detachPlancode: /* @ngInject */ ($http, OvhApiServices, serviceName) =>
        $http
          .get(`/hosting/web/${serviceName}/emailOption`)
          .then(({ data: emailOptionIds }) => {
            const [emailOptionId] = emailOptionIds;
            console.log(`EmailOption ID : ${emailOptionId}`);
            return $http.get(`/email/domain/${serviceName}/serviceInfos`);
          })
          .then(({ data: serviceInfos }) => {
            const { serviceId: serviceInfosId } = serviceInfos;
            console.warn(`ServiceInfo ID : ${serviceInfosId}`);
            return $http.get(`/services/${serviceInfosId}/detach`);
          })
          .then(({ data: detach }) => {
            console.log(`Detachable : ${detach}`);
          }),
    },
    translations: { value: ['.'], format: 'json' },
  });

  $stateProvider.state('app.hosting.upgrade', {
    url: '/change-offer',
    templateUrl: 'hosting/offer/upgrade/hosting-offer-upgrade.html',
    controller: 'HostingUpgradeOfferCtrl',
    reloadOnSearch: false,
    translations: ['.'],
  });
};
