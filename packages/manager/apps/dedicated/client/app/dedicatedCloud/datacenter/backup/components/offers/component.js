import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    backup: '<',
    backupOffers: '<',
    previewMode: '<',
    user: '<',
  },
  controller,
  template,
};
