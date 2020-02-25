import filter from 'lodash/filter';
import head from 'lodash/head';
import map from 'lodash/map';

export default /* @ngInject */ ($stateProvider, $urlRouterProvider) => {
  $stateProvider.state('app', {
    url: '/',
    component: 'hubDashboard',
    resolve: {
      hub: /* @ngInject */ ($http) =>
        $http
          .get('/hub', {
            serviceType: 'aapi',
          })
          .then(({ data }) => data),

      notifications: /* @ngInject */ ($translate, hub) =>
        map(
          filter(hub.data.notifications.data, (notification) =>
            ['warning', 'error'].includes(notification.level),
          ),
          (notification) => ({
            ...notification,
            // force sanitization to null as this causes issues with UTF-8 characters
            description: $translate.instant(
              'manager_hub_notification_warning',
              { content: notification.description },
              undefined,
              false,
              null,
            ),
          }),
        ),
      order: /* @ngInject */ ($q, hub, OrderTracking) => {
        const lastOrder = hub.data.lastOrder.data;
        return $q
          .all({
            status: OrderTracking.getOrderStatus(lastOrder),
            details: OrderTracking.getOrderDetails(lastOrder),
          })
          .then(({ status, details }) => ({
            ...lastOrder,
            status,
            ...head(details),
          }))
          .then((order) =>
            OrderTracking.getCompleteHistory(order).then((history) => ({
              ...order,
              ...history,
            })),
          );
      },

      services: /* @ngInject */ (hub) => hub.data.services.data.data,
    },
  });

  $urlRouterProvider.otherwise('/');
};
