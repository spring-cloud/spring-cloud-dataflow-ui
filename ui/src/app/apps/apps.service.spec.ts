import { AppsService } from './apps.service';
import { Observable } from 'rxjs/Rx'
import { ErrorHandler } from '../shared/model/error-handler';

xdescribe('AppsService', () => {

  let appsService: AppsService;
  let mockHttp;
  const errorHandler = new ErrorHandler();

  beforeEach(() => {
    mockHttp = jasmine.createSpyObj('mockHttp', ['get']);
    appsService = new AppsService(this.mockHttp, this.errorHandler);
  });

  it('should be created', () => {
    mockHttp.get.and.returnValue(Observable.of(false));
    // aboutService.getAboutInfo();
    // expect(aboutService.getAboutInfo()).toBe();
  });
});
