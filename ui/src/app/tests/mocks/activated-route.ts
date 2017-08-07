import { BehaviorSubject } from 'rxjs/BehaviorSubject';

/**
 * Mock for angular ActivatedRoute.
 *
 * If logic for getting or subsribing to parameters is as:
 * this.sub = this.route.params.subscribe(params => {
 *   this.id = params['id'];
 * });
 *
 * Create mock and set params as shown below:
 * const activeRoute = new MockActivatedRoute();
 * activeRoute.testParams = { id: 'myparamid' };
 *
 * @author Janne Valkealahti
 */
export class MockActivatedRoute {
  private _testParams: {};
  private subject = new BehaviorSubject(this.testParams);
  params  = this.subject.asObservable();

  get testParams() {
    return this._testParams;
  }

  set testParams(params: any) {
    this._testParams = params;
    this.subject.next(params);
  }
}
