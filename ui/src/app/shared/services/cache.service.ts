import {Injectable} from '@angular/core';

/**
 * A service for save a context.
 * A context is an Map of key/value.
 * Method get init a context and return a value in all case
 *
 * @author Damien Vitrac
 */
@Injectable()
export class CacheService {

  /**
   * Stored Data
   */
  private data = {};

  constructor() {
  }

  /**
   * Get a context, create it if not exist
   *
   * @param {string} key
   * @param defaultValues
   * @returns {any}
   */
  get(key: string, ...defaultValues): any {
    if (!this.data.hasOwnProperty(key)) {
      const value = Object.assign({}, ...defaultValues);
      this.data[key] = JSON.stringify(value);
    }
    return JSON.parse(this.data[key]);
  }

  /**
   * Save a context
   *
   * @param {string} key
   * @param values
   */
  set(key: string, ...values) {
    const value = Object.assign({}, ...values);
    this.data[key] = JSON.stringify(value);
  }

}
