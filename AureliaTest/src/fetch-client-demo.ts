import { autoinject } from "aurelia-framework"
import { HttpClient, json } from "aurelia-fetch-client"

@autoinject
export class FetchClientDemo {

  message : string;

  constructor(private http: HttpClient) {
  }

  async activate() {
  }

  async getValues() {
    let data: Response = await this.http.fetch('values/Values');
    let x = await data.json();
    this.message = x.toString();
  }

  async getValue() {
    let data: Response = await this.http.fetch('values/GetValue', {
        body: json('1')
      });

    let x = await data.json();
    this.message = x.x;
  }

  async addValue(val: string) {
    await this.http.fetch('values/AddValue', {
      body: json(val)
    });
    this.activate();
  }
}