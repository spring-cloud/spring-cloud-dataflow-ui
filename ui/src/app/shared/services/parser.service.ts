import { Injectable } from '@angular/core';
import { parse } from './parser';

@Injectable()
export class ParserService {

  constructor() {
  }

  parseDsl(text: string, mode?: string) {
  	return parse(text, mode);
  }

}
