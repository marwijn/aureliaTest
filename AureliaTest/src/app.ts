import { Router, RouterConfiguration } from 'aurelia-router';

export class App {
  public router: Router;

  public configureRouter(config: RouterConfiguration, router: Router) {
    config.title = 'Aurelia';
    config.map([
      { route: ['', 'bootstrap-demo'], name: 'bootstrap-demo', moduleId: 'bootstrap-demo', nav: true, title: 'Bootstrap' },
      { route: ['fetch-client-demo'], name: 'fetch-client-demo', moduleId: 'fetch-client-demo', nav: true, title: 'FetchClientDemo' }
    ]);

    this.router = router;
  }
}