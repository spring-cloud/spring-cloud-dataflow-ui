import {Injectable} from '@angular/core';
import {v4 as uuidv4} from 'uuid';
import {LocalStorageService} from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  constructor(private localStorageService: LocalStorageService) {}

  create(args: any): string {
    const key = 'G-' + uuidv4();
    this.localStorageService.set(key, args);
    return key;
  }

  isSimilar(str: string): boolean {
    str = str || '';
    if (!str.startsWith('G-')) {
      return false;
    }
    const g = 'G-'.length;
    if (
      str.length !== 36 + g ||
      str[8 + g] !== '-' ||
      str[13 + g] !== '-' ||
      str[18 + g] !== '-' ||
      str[23 + g] !== '-'
    ) {
      return false;
    }
    return true;
  }

  group(name: string): any {
    return this.localStorageService.get(name);
  }
}
