import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

/**
 * A service for global notifications.
 * Allows to push success, error, warning and info notification
 *
 * @author Damien Vitrac
 */
@Injectable()
export class NotificationService {

  constructor(private toastrService: ToastrService) {
  }

  success(message) {
    this.toastrService.success(message);
  }

  info(message) {
    this.toastrService.info(message);
  }

  error(message) {
    this.toastrService.error(message);
  }

  warning(message) {
    this.toastrService.warning(message);
  }

}
