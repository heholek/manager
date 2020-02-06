import filter from 'lodash/filter';
import includes from 'lodash/includes';

export default class {
  /* @ngInject */
  constructor($filter, $timeout, $translate, $window) {
    this.$filter = $filter;
    this.$timeout = $timeout;
    this.$translate = $translate;
    this.$window = $window;
  }

  $onInit() {
    // Auto-select duration
    this.prices = filter(this.catalogAddon.pricings, ({ capacities }) =>
      includes(capacities, 'renew'),
    );
    [this.price] = this.prices;
    this.interval = this.price.interval;
    this.isEditable = true;

    if (this.catalogAddon.pricings.length === 1) {
      // Go directly to the next step
      this.currentIndex = 1;
      this.isEditable = false;
    }

    this.workflowOptions = {
      catalog: this.catalog,
      catalogItemTypeName: 'ADDON',
      productName: 'webHosting',
      serviceNameToAddProduct: this.serviceName,
      onBeforePricingGetPlancode: this.getPlancode.bind(this),
      onGetConfiguration: this.getConfiguration.bind(this),
    };
  }

  getConfiguration() {
    return [
      {
        label: 'legacy_domain',
        value: this.serviceName,
      },
    ];
  }

  getPlancode() {
    return this.isOptionFree ? 'cdn_free_business' : 'cdn_business';
  }

  onCheckoutSuccess(checkoutResult) {
    if (this.isOptionFree) {
      this.goBack(
        this.$translate.instant(
          'hosting_dashboard_cdn_order_success_activation',
        ),
      );
    } else {
      this.$window.open(checkoutResult.url, '_blank');
      this.goBack(
        this.$translate.instant('hosting_dashboard_cdn_order_success', {
          t0: checkoutResult.url,
        }),
      );
    }
  }

  resetCart() {
    if (this.cart) {
      this.cart = undefined;
      this.cartId = undefined;
    }
  }

  async prepareCheckout() {
    if (!this.cart && !this.checkoutLoading) {
      this.checkoutLoading = true;
      const { cart, cartId } = await this.prepareOrderCart();

      this.$timeout(() => {
        this.cart = cart;
        this.cartId = cartId;
        this.checkoutLoading = false;
      });
    }
  }

  checkout() {
    this.checkoutLoading = true;

    this.checkoutOrderCart(
      // Autovalidate if the order is free
      this.isOptionFree
        ? this.isOptionFree
        : this.autoPayWithPreferredPaymentMethod,
      this.cartId,
    );
  }

  getDuration(interval) {
    return this.$filter('wucDuration')(interval.toString(), 'longDate');
  }
}
