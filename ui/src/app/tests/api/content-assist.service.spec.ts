import { ContentAssistService } from '../../flo/stream/content-assist.service';
import { Observable, of } from 'rxjs';

export class ContentAssistServiceMock {

  static mock: any = null;

  constructor() {
  }

  getProposals(prefix: string): Observable<Array<string>> {
    return of(['foo', 'bar']);
  }

  static get provider() {
    if (!ContentAssistServiceMock.mock) {
      ContentAssistServiceMock.mock = new ContentAssistServiceMock();
    }
    return { provide: ContentAssistService, useValue: ContentAssistServiceMock.mock };
  }

}
