import { EventEmitter, Injectable } from '@angular/core';

/**
 * Service HTTP Loader
 */
@Injectable()
export class HttpLoaderService {

  /**
   * Request Array
   */
  private requests: Array<any> = [];

  /**
   * Last Status
   */
  private lastStatus = false;

  /**
   * On Change Emit
   */
  public onChange: EventEmitter<boolean> = new EventEmitter();

  /**
   * Add key
   * @param key
   */
  add(key: string) {
    this.requests.push(key);
    this.update();
  }

  /**
   * Complete
   * @param key
   */
  complete(key) {
    this.requests = this.requests.filter(request => request !== key);
    this.update();
  }

  /**
   * Update
   */
  update() {
    const status = this.requests.length > 0;
    if (status !== this.lastStatus) {
      this.lastStatus = status;
      this.onChange.emit(status);
    }
  }

}
