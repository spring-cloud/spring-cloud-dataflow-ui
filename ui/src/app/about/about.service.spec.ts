import { AboutService } from './about.service';
import { Observable } from 'rxjs/Rx'
import { ErrorHandler } from '../shared/model/error-handler';

xdescribe('AboutService', () => {

  let aboutService: AboutService;
  let mockHttp;
  const errorHandler = new ErrorHandler();

  beforeEach(() => {
    mockHttp = jasmine.createSpyObj('mockHttp', ['get']);
    aboutService = new AboutService(this.mockHttp, this.errorHandler);
  });

  it('should be created', () => {
    mockHttp.get.and.returnValue(Observable.of(false));
    aboutService.getAboutInfo();
    // expect(aboutService.getAboutInfo()).toBe();
  });
});
