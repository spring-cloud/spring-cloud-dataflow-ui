import { EventEmitter, Injectable } from '@angular/core';

@Injectable()
export class HttpLoaderService {

  private _requests: Array<any> = [];

  private _lastStatus = false;

  public onChange: EventEmitter<boolean> = new EventEmitter();

  add(key: string) {
    this._requests.push(key);
    this.update();
  }

  complete(key) {
    this._requests = this._requests.filter(request => request !== key);
    this.update();
  }

  update() {
    const status = this._requests.length > 0;
    if (status !== this._lastStatus) {
      this._lastStatus = status;
      this.onChange.emit(status);
    }
  }

}
