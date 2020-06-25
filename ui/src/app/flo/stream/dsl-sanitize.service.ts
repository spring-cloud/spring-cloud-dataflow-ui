import { Injectable } from '@angular/core';
import { TextToGraphConverter } from './text-to-graph';
import { Parser } from '../shared/service/parser';

/**
 * Helper to break down stream DSL text into stream definitions
 *
 * @author Alex Boyko
 */
@Injectable()
export class SanitizeDsl {

  convert(dsl: string, parsedStreams: Parser.ParseResult) {
    return TextToGraphConverter.convertParseResponseToJsonGraph(dsl, parsedStreams);
  }

}
