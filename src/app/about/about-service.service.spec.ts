import { TestBed, inject } from '@angular/core/testing';

import { AboutServiceService } from './about-service.service';

describe('AboutServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AboutServiceService]
    });
  });

  it('should be created', inject([AboutServiceService], (service: AboutServiceService) => {
    expect(service).toBeTruthy();
  }));
});
