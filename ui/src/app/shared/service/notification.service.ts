import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private toastrService: ToastrService) {
  }

  success(title: string, message: string) {
    this.toastrService.success(message, title);
  }

  info(title: string, message: string) {
    this.toastrService.info(message, title);
  }

  error(title: string, message: string) {
    this.toastrService.error(message, title);
  }

  warning(title: string, message: string) {
    this.toastrService.warning(message, title);
  }
}
