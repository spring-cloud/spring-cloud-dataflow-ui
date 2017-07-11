import { AboutService } from './about.service';
import { Observable } from 'rxjs/Rx'

xdescribe('AboutService', () => {

  let aboutService: AboutService;
  let mockHttp;

  beforeEach(() => {
    mockHttp = jasmine.createSpyObj('mockHttp', ['get']);
    aboutService = new AboutService(this.mockHttp);
  });

  it('should be created', () => {
    mockHttp.get.and.returnValue(Observable.of(false));
    aboutService.getAboutInfo();
    //expect(aboutService.getAboutInfo()).toBe();
  });
});
