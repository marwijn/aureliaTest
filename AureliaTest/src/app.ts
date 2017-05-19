import {autoinject} from 'aurelia-framework';
import { Router, RouterConfiguration, NavigationInstruction, Next, Redirect } from 'aurelia-router';
import { HttpClient } from 'aurelia-fetch-client';
import { FetchConfig, AuthService } from 'aurelia-authentication';
import {EventAggregator, Subscription} from 'aurelia-event-aggregator';
// ReSharper disable once UnusedLocalImport
import * as jwt_decode from 'jwt-decode';

@autoinject
export class App {

  public router: Router;
  public userId : string;
  private subscription : Subscription;

  constructor(private http: HttpClient,
    private config: FetchConfig,
    private auth: AuthService,
    private eventAggregator : EventAggregator) {
    this.configHttp();
  }

  public attached() {
// ReSharper disable once TsResolvedFromInaccessibleModule
    if (this.auth.authenticated) this.userId = jwt_decode(this.auth.getAccessToken()).userid;

    this.subscription = this.eventAggregator.subscribe('authentication-change',
      () => {
// ReSharper disable once TsResolvedFromInaccessibleModule
        if (this.auth.authenticated) {
          this.userId = jwt_decode(this.auth.getAccessToken()).userid;
        } else {
          this.userId = null;
        }      
      });
  }

  public detached() {
    this.subscription.dispose();
  }


  public configureRouter(config: RouterConfiguration, router: Router) {
    config.title = 'Aurelia';
    config.addPipelineStep('authorize', AuthorizeStep);
    config.map([
      {
        route: ['', 'bootstrap-demo'],
        name: 'bootstrap-demo',
        moduleId: 'bootstrap-demo',
        nav: true,
        title: 'Bootstrap',
        auth: true
      },
      {
        route: ['fetch-client-demo'],
        name: 'fetch-client-demo',
        moduleId: 'fetch-client-demo',
        nav: true,
        title: 'FetchClientDemo',
        auth: true
      },
      {
        route: ['login'],
        name: 'login',
        moduleId: 'login',
        nav: true,
        title: 'Login'
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

    this.config.configure(this.http);
  }
}

@autoinject
class AuthorizeStep {
    constructor(private authService: AuthService) { }

    run(navigationInstruction: NavigationInstruction, next: Next): Promise<any> {
        if (navigationInstruction.getAllInstructions().some(i => i.config.auth)) {
            let isLoggedIn = this.authService.isAuthenticated();

            if (!isLoggedIn) {
                return next.cancel(new Redirect('login'));
            }
        }

        return next();
    }
}

