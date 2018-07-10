import { Injectable } from '@angular/core';
import { LocalStorageService } from 'angular-2-local-storage';

/**
 * A service for global logs.
 *
 * @author Damien Vitrac
 */
@Injectable()
export class GroupRouteService {

  constructor(private localStorageService: LocalStorageService) {
  }

  create(args): string {
    const key = `group-${'xxxxx-xxxxx-xxxxx-xxxxx'.replace(/[xy]/g, function (c) {
      const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    })}`;
    this.localStorageService.set(key, args);
    return key;
  }

  isSimilar(str: string): boolean {
    str = str || '';
    if (!str.startsWith('group-')) {
      return false;
    }
    if (str.length !== 29 || str[11] !== '-' || str[17] !== '-' || str[23] !== '-') {
      return false;
    }
    return true;
  }

  group(name) {
    return this.localStorageService.get(name);
  }

}
