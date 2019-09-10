import template from './restored-instances.html';
import controller from './restored-instances.controller';

export default {
  bindings: {
    clusterId: '<',
    endpoints: '<',
    goToDelete: '<',
    restoredInstances: '<',
  },
  controller,
  template,
};