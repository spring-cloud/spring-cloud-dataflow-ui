import { NotificationService } from '../../shared/service/notification.service';

export class NotificationServiceMock {

  static mock: NotificationServiceMock = null;

  successNotifications: any = [];

  errorNotification: any = [];

  warningNotification: any = [];

  infoNotification: any = [];

  constructor() {
  }

  success(title, message?: string): any {
    this.successNotifications.push({ title, message });
  }

  error(title, message?: string): any {
    this.errorNotification.push({ title, message });
  }

  info(title, message?: string): any {
    this.infoNotification.push({ title, message });
  }

  warning(title, message?: string): any {
    this.warningNotification.push({ title, message });
  }

  clearAll() {
    this.successNotifications.length = 0;
    this.errorNotification.length = 0;
  }

  static get provider() {
    if (!NotificationServiceMock.mock) {
      NotificationServiceMock.mock = new NotificationServiceMock();
    }
    return { provide: NotificationService, useValue: NotificationServiceMock.mock };
  }

}
