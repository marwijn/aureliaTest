import {Aurelia} from 'aurelia-framework'
import environment from './environment';
import config from './authConfig'

export function configure(aurelia: Aurelia) {
  aurelia.use
    .standardConfiguration()
    .feature('resources')
    .plugin('aurelia-authentication',
      (baseConfig) => {
        baseConfig.configure(config);
      });

  if (environment.debug) {
    aurelia.use.developmentLogging();
  }

  if (environment.testing) {
    aurelia.use.plugin('aurelia-testing');
  }

  aurelia.start().then(() => aurelia.setRoot());
}
