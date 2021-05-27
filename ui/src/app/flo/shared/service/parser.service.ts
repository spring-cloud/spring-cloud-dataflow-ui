import {Injectable} from '@angular/core';
import {Parser} from './parser';

@Injectable()
export class ParserService {
  constructor() {}

  parseDsl(text: string, mode?: string): any {
    return Parser.parse(text, mode);
  }

  simplifyDsl(dsl: string): string {
    return Parser.simplify(dsl);
  }
}
