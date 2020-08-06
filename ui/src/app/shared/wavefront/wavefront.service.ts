import { Injectable } from '@angular/core';
import { SharedAboutService } from '../services/shared-about.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FeatureInfo } from '../model/about/feature-info.model';

@Injectable()
export class WavefrontService {

  constructor(private sharedAboutService: SharedAboutService) {
  }

  isAllowed(): Observable<boolean> {
    return this.sharedAboutService
      .getFeatureInfo()
      .pipe(map((featuredInfo: FeatureInfo) => featuredInfo.wavefrontEnabled));
  }

}
