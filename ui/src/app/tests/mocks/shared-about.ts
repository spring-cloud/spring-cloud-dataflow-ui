import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { FeatureInfo } from '../../shared/model/about/feature-info.model';
import { AboutInfo } from '../../shared/model/about/about-info.model';

/**
 * Mock for SharedAboutService.
 *
 * @author Gunnar Hillert
 */
export class MocksSharedAboutService {

  public aboutInfo: any;
  public featureInfo = new FeatureInfo();
  public featureInfoSubject = new Subject<FeatureInfo>();

  public dataflowVersionInfo: AboutInfo;

  constructor(dataflowVersionInfo?: AboutInfo) {
    this.dataflowVersionInfo = dataflowVersionInfo ? dataflowVersionInfo : new AboutInfo();
  }

  getAboutInfo(): Observable<any> {
    this.aboutInfo = this.dataflowVersionInfo;
    this.featureInfo = new FeatureInfo().deserialize(this.dataflowVersionInfo.featureInfo);
    this.featureInfoSubject.next(this.featureInfo);

    return Observable.of(this.dataflowVersionInfo);
  }


  getFeatureInfo(): Observable<FeatureInfo> {
    return this.getAboutInfo().map(result => {
      return new FeatureInfo().deserialize(result.featureInfo);
    });
  }

}
