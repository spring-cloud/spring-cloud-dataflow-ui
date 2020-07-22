import { Injectable, isDevMode } from '@angular/core';

/**
 * A service for global logs.
 *
 * @author Damien Vitrac
 */
@Injectable({
  providedIn: 'root'
})
export class LoggerService {

  constructor() {
  }

  static log(value: any, ...rest: any[]) {
    if (isDevMode()) {
      console.log(value, ...rest);
    }
  }

  static error(value: any, ...rest: any[]) {
    console.error(value, ...rest);
  }

  static warn(value: any, ...rest: any[]) {
    console.warn(value, ...rest);
  }

  log(value: any, ...rest: any[]) {
    LoggerService.log(value, ...rest);
  }

  error(value: any, ...rest: any[]) {
    LoggerService.error(value, ...rest);
  }

  warn(value: any, ...rest: any[]) {
    LoggerService.warn(value, ...rest);
  }
}
