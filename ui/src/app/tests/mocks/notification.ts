import { NotificationService } from '../../shared/services/notification.service';

/**
 * Mock for NotificationService.
 *
 * Provide mocked service to testbed:
 * const notificationService = new MockNotificationService();
 * TestBed.configureTestingModule({
 *   providers: [
 *     { provide: NotificationService, useValue: notificationService }
 *   ]
 * }).compileComponents();
 *
 * Then it's possible to access and expect toasts:
 * expect(NotificationService.testSuccess.length).toBe(1);
 * expect(NotificationService.testSuccess).toContain('App info loaded.');
 *
 * @author Janne Valkealahti
 * @author Damien Vitrac
 */
export class MockNotificationService extends NotificationService {

  private _successToasts: any = [];

  private _errorToasts: any = [];

  private _warningToasts: any = [];

  private _infoToasts: any = [];

  constructor() {
    super(null);
  }

  success(message?: string): any {
    this._successToasts.push(message);
  }

  error(message?: string): any {
    this._errorToasts.push(message);
  }

  info(message?: string): any {
    this._infoToasts.push(message);
  }

  warning(message?: string): any {
    this._warningToasts.push(message);
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

  get testWarning() {
    return this._warningToasts;
  }

  get testInfo() {
    return this._infoToasts;
  }

}
