import { ToastOptions, ToastyConfig, ToastyService } from 'ng2-toasty';

/**
 * Mock for ToastyService.
 *
 * Provide mocked service to testbed:
 * const toastyService = new MockToastyService();
 * TestBed.configureTestingModule({
 *   providers: [
 *     { provide: ToastyService, useValue: toastyService }
 *   ]
 * }).compileComponents();
 *
 * Then it's possible to access and expect toasts:
 * expect(toastyService.testSuccess.length).toBe(1);
 * expect(toastyService.testSuccess).toContain('App info loaded.');
 *
 * @author Janne Valkealahti
 */
export class MockToastyService extends ToastyService {
  private _successToasts: any = [];
  private _errorToasts: any = [];

  constructor(config?: ToastyConfig) {
    super(config);
  }

  success(options: ToastOptions | string | number): void {
    this._successToasts.push(options);
  }

  error(options: ToastOptions | string | number): void {
    this._successToasts.push(options);
  }

  clearAll() {
    this._successToasts.length = 0;
    this._errorToasts.length = 0;
  }

  get testSuccess() {
    return this._successToasts;
  }

  get testError() {
    return this._errorToasts;
  }
}
