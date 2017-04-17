import { autoinject } from "aurelia-framework"
import { HttpClient } from "aurelia-fetch-client"


@autoinject
export class FetchClientDemo {

  message : string;

  constructor(private http: HttpClient) {
  }

  async activate() {
    let data: Response = await this.http.fetch("api/values");
    let x = await data.json();
    this.message = x[0].toString();
  }
}