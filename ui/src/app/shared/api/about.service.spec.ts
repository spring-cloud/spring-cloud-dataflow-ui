// import { AboutService } from './about.service';
// import { of } from 'rxjs';
// import { LOAD } from '../../tests/data/about';
//
// describe('shared/api/about.service.ts', () => {
//   let mockHttp;
//   let aboutService;
//   let jsonData = {};
//
//   beforeEach(() => {
//     mockHttp = {
//       delete: jasmine.createSpy('delete'),
//       get: jasmine.createSpy('get'),
//       post: jasmine.createSpy('post'),
//       put: jasmine.createSpy('put'),
//     };
//     jsonData = {};
//     aboutService = new AboutService(mockHttp);
//   });
//
//   it('load', async (done) => {
//     mockHttp.get.and.returnValue(of(LOAD));
//     await aboutService.load().subscribe();
//     await aboutService.getAbout().subscribe();
//     const httpUri = mockHttp.get.calls.mostRecent().args[0];
//     expect(httpUri).toEqual('/about');
//     done();
//   });
//
// });
