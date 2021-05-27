import {NotificationService} from '../../shared/service/notification.service';

export class NotificationServiceMock {
  static mock: NotificationServiceMock = null;

  successNotifications: any = [];

  errorNotification: any = [];

  warningNotification: any = [];

  infoNotification: any = [];

  constructor() {}

  success(title: string, message?: string): any {
    this.successNotifications.push({title, message});
  }

  error(title: string, message?: string): any {
    this.errorNotification.push({title, message});
  }

  info(title: string, message?: string): any {
    this.infoNotification.push({title, message});
  }

  warning(title: string, message?: string): any {
    this.warningNotification.push({title, message});
  }

  clearAll(): void {
    this.successNotifications = [];
    this.errorNotification = [];
  }

  static get provider(): any {
    if (!NotificationServiceMock.mock) {
      NotificationServiceMock.mock = new NotificationServiceMock();
    }
    return {provide: NotificationService, useValue: NotificationServiceMock.mock};
  }
}
