import { MESSAGE_CONTAINER } from '../../details.constants';
import { STATUS } from '../../../../enterprise-cloud-database.constants';

export default /* @ngInject */($stateProvider) => {
  $stateProvider
    .state('enterprise-cloud-database.service.details.settings.edit-security-group', {
      layout: 'modal',
      params: {
        securityGroup: null,
      },
      resolve: {
        goBack: /* @ngInject */ ($state, clusterId, CucCloudMessage) => (message = false,
          type = STATUS.SUCCESS) => {
          const reload = message && type === STATUS.SUCCESS;
          const state = 'enterprise-cloud-database.service.details.settings';
          const promise = $state.go(state, { clusterId }, { reload });
          if (message) {
            promise.then(() => CucCloudMessage[type](message, MESSAGE_CONTAINER));
          }
          return promise;
        },
        securityGroup: /* @ngInject */ $transition$ => $transition$.params().securityGroup,
      },
      translations: {
        value: ['.'],
        format: 'json',
      },
      url: '/edit-security-group',
      views: {
        modal: {
          component: 'ovhManagerEnterpriseCloudDatabaseServiceDetailsSettingsEditSecurityGroupComponent',
        },
      },
    });
};