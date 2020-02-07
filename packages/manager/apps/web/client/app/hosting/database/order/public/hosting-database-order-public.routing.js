import component from './hosting-database-order-public.component';

export const state = {
  name: 'app.hosting.database.order-public',
  url: '/order-public',
  component: component.name,
  resolve: {
    catalog: /* @ngInject */ (HostingDatabaseOrderPublicService) =>
      HostingDatabaseOrderPublicService.getCatalog(),
    characteristicsOfAvailableProducts: /* @ngInject */ (
      HostingDatabaseOrderPublicService,
      serviceName,
    ) => {
      return HostingDatabaseOrderPublicService.getCharacteristicsOfAvailableProducts(
        serviceName,
      );
    },
    goBack: /* @ngInject */ (goToHosting) => goToHosting,
    hosting: /* @ngInject */ (Hosting, serviceName) =>
      Hosting.getSelected(serviceName, true),
    onError: /* @ngInject */ ($translate, goBack) => (error) =>
      goBack(
        $translate.instant('ovhManagerHostingDatabaseOrderPublic_error', {
          message: error.data.message,
        }),
        'error',
        'app.alerts.database',
      ),
    onSuccess: /* @ngInject */ ($translate, goBack) => (checkoutResult) =>
      goBack(
        $translate.instant(
          checkoutResult.autoPayWithPreferredPaymentMethod
            ? 'ovhManagerHostingDatabaseOrderPublic_success_noCheckout'
            : 'ovhManagerHostingDatabaseOrderPublic_success_checkout',
          {
            url: checkoutResult.url,
          },
        ),
        'success',
        'app.alerts.database',
      ),
    serviceName: /* @ngInject */ ($transition$) =>
      $transition$.params().productId,
    user: /* @ngInject */ (OvhApiMe) => OvhApiMe.v6().get().$promise,
  },
};

export default {
  state,
};
