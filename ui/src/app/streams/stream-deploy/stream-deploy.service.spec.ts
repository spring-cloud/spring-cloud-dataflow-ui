import { TestBed, inject } from '@angular/core/testing';

import { StreamDeployService } from './stream-deploy.service';

describe('StreamDeployService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StreamDeployService]
    });
  });

  it('should be created', inject([StreamDeployService], (service: StreamDeployService) => {
    expect(service).toBeTruthy();
  }));
});
