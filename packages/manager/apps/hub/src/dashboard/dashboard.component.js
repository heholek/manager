import template from './dashboard.html';

export default {
  bindings: {
    bills: '<',
    errors: '<',
    me: '<',
    billingServices: '<',
    notifications: '<',
    order: '<',
    services: '<',
    trackingPrefix: '<',
  },
  template,
};
