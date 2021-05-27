import {Injectable, isDevMode} from '@angular/core';

/**
 * A service for global logs.
 *
 * @author Damien Vitrac
 */
@Injectable({
  providedIn: 'root'
})
export class LoggerService {
  constructor() {}

  static log(value: any, ...rest: any[]): void {
    if (isDevMode()) {
      console.log(value, ...rest);
    }
  }

  static error(value: any, ...rest: any[]): void {
    console.error(value, ...rest);
  }

  static warn(value: any, ...rest: any[]): void {
    console.warn(value, ...rest);
  }

  log(value: any, ...rest: any[]): void {
    LoggerService.log(value, ...rest);
  }

  error(value: any, ...rest: any[]): void {
    LoggerService.error(value, ...rest);
  }

  warn(value: any, ...rest: any[]): void {
    LoggerService.warn(value, ...rest);
  }
}
