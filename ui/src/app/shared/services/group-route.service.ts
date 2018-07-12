import { Injectable } from '@angular/core';
import { LocalStorageService } from 'angular-2-local-storage';

import * as uuidv4 from 'uuid/v4';

/**
 * A service for create group route.
 *
 * @author Damien Vitrac
 */
@Injectable()
export class GroupRouteService {

  constructor(private localStorageService: LocalStorageService) {
  }

  /**
   * Create an unique UUID
   * Format:
   * 6ba7b810-9dad-11d1-80b4-00c04fd430c8
   *
   * @param args
   * @returns {string}
   */
  create(args): string {
    const key = 'group-' + uuidv4();
    this.localStorageService.set(key, args);
    return key;
  }

  isSimilar(str: string): boolean {
    str = str || '';
    if (!str.startsWith('group-')) {
      return false;
    }
    const g = `group-`.length;
    if (str.length !== (36 + g) || str[(8 + g)] !== '-' || str[(13 + g)] !== '-' || str[(18 + g)] !== '-' || str[(23 + g)] !== '-') {
      return false;
    }
    return true;
  }

  group(name) {
    return this.localStorageService.get(name);
  }

}
