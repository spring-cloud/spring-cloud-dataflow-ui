/**
 * Mock for Response Object.
 *
 * Provide mocked response to allow extract methods in services to retrieve a json object:
 * const response = new MockResponse();
 * response.body = {some json};
 *
 * @author Glenn Renfro
 */
export class MockResponse {

  private _body: any;

  get body(): any {
    return this._body;
  }

  set body(value: any) {
    this._body = value;
  }

  public json(): any {
    return this.body;
  }

}
