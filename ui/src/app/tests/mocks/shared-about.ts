import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { FeatureInfo } from '../../shared/model/about/feature-info.model';
import { DataflowVersionInfo } from './about';

/**
 * Mock for SharedAboutService.
 *
 * @author Gunnar Hillert
 */
export class MocksSharedAboutService {

  public aboutInfo: any;
  public featureInfo = new FeatureInfo();
  public featureInfoSubject = new Subject<FeatureInfo>();

  getAboutInfo(): Observable<any> {
    const dataflowVersionInfo = new DataflowVersionInfo();

    this.aboutInfo = dataflowVersionInfo;
    this.featureInfo = new FeatureInfo().deserialize(dataflowVersionInfo.featureInfo);
    this.featureInfoSubject.next(this.featureInfo);

    return Observable.of(dataflowVersionInfo);
  }
}
