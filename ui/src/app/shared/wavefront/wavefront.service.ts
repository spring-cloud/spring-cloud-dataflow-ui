import { Injectable } from '@angular/core';
import { AboutService } from '../api/about.service';

@Injectable({
  providedIn: 'root'
})
export class WavefrontService {

  constructor(private aboutService: AboutService) {
  }

  isAllowed(): Promise<boolean> {
    return this.aboutService
      .isFeatureEnabled('wavefront');
  }

}
