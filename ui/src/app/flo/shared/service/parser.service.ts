import { Injectable } from '@angular/core';
import { Parser } from './parser';

@Injectable()
export class ParserService {

    constructor() {
    }

    parseDsl(text: string, mode?: string) {
        return Parser.parse(text, mode);
    }

    simplifyDsl(dsl: string) {
      return Parser.simplify(dsl);
    }

}
