import { autoinject } from "aurelia-framework"
import { HttpClient, json } from "aurelia-fetch-client"
import { AuthService } from "aurelia-authentication"

@autoinject
export class FetchClientDemo {

  email = "";
  password = "";

  constructor(private auth: AuthService, private http: HttpClient) {
  }

  login() {
    this.auth.login({
      username: this.email,
      password: this.password
    });
  }

  logout() {
    this.auth.logout('');
  }

  authenticate() {
    this.auth.authenticate('google')
      .then(
          response => console.debug("testing: " + response.toString()));
  }
}