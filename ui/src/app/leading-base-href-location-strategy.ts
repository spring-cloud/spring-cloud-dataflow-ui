import { Injectable } from '@angular/core';
import { HashLocationStrategy } from '@angular/common';

@Injectable()
export class LeadingBaseHrefLocationStrategy extends HashLocationStrategy {
  prepareExternalUrl(internal: string): string {
    return this.getBaseHref() + '#' + internal;
  }
}
