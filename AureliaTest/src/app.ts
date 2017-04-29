import {autoinject} from 'aurelia-framework';
import { Router, RouterConfiguration } from 'aurelia-router';
import { HttpClient } from 'aurelia-fetch-client';

@autoinject
export class App {

  public router: Router;

  constructor(private http: HttpClient) {
    this.configHttp();
  }

  public configureRouter(config: RouterConfiguration, router: Router) {
    config.title = 'Aurelia';
    config.map([
      {
        route: ['', 'bootstrap-demo'],
        name: 'bootstrap-demo',
        moduleId: 'bootstrap-demo',
        nav: true,
        title: 'Bootstrap'
      },
      {
        route: ['fetch-client-demo'],
        name: 'fetch-client-demo',
        moduleId: 'fetch-client-demo',
        nav: true,
        title: 'FetchClientDemo'
      }
    ]);

    this.router = router;
  }

  configHttp(): void {
    this.http.configure(config => {
      config
        .withBaseUrl('api/')
        .withDefaults({
          method: "POST",
          credentials: 'same-origin',
          headers: {
            'Accept': 'application/json',
            'X-Requested-With': 'Fetch'
          }
        })
        .withInterceptor({
          request(request) {
            console.log(`Requesting ${request.method} ${request.url}`);
            return request;
          },
          response(response: Response) {
            console.log(`Received ${response.status} ${response.url}`);
            return response;
          }
        });
    });
  }
}