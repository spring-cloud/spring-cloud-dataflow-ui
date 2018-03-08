import {Observable} from 'rxjs/Observable';
import {URLSearchParams} from '@angular/http';

/**
 * Test Streams Services.
 *
 * @author Glenn Renfro
 * @author Damien Vitrac
 */
xdescribe('StreamsService', () => {

  beforeEach(() => {
    this.mockHttp = jasmine.createSpyObj('mockHttp', ['delete', 'get', 'post']);
    this.jsonData = {};
  });

});
