import { Router, RouterConfiguration } from 'aurelia-router';

export class App {
  public router: Router;

  public configureRouter(config: RouterConfiguration, router: Router) {
    config.title = 'Aurelia';
    config.map([
      { route: ['', 'bootstrap-demo'], name: 'bootstrap-demo', moduleId: 'bootstrap-demo', nav: true, title: 'Bootstrap' }
    ]);

    this.router = router;
  }
}