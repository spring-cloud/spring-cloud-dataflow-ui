import { Serializable } from '../serialization/serializable.model';
import { LoggerService } from '../../services/logger.service';

/**
 * Contains meta data about the supported features.
 *
 * @author Gunnar Hillert
 * @author Damien Vitrac
 */
export class FeatureInfo implements Serializable<FeatureInfo> {

  public analyticsEnabled = false;
  public streamsEnabled = false;
  public tasksEnabled = false;
  public skipperEnabled = false;
  public schedulerEnabled = false;


  /**
   * Set the FeatureInfo object to default values.
   */
  public reset() {
    this.analyticsEnabled = false;
    this.streamsEnabled = false;
    this.tasksEnabled = false;
    this.skipperEnabled = false;
    this.schedulerEnabled = false;
  }

  public deserialize(input) {
    this.analyticsEnabled = input.analyticsEnabled;
    this.streamsEnabled = input.streamsEnabled;
    this.tasksEnabled = input.tasksEnabled;
    this.skipperEnabled = input.skipperEnabled;
    this.schedulerEnabled = input.schedulerEnabled;
    return this;
  }

  /**
   * Perform a check of the passed in string
   * whether it matches any of the supported and set features.
   *
   * @param feature
   */
  public isFeatureEnabled(feature: string): boolean {
    if (feature) {
      switch (feature) {
        case 'analyticsEnabled': {
          return this.analyticsEnabled;
        }
        case 'streamsEnabled': {
          return this.streamsEnabled;
        }
        case 'tasksEnabled': {
          return this.tasksEnabled;
        }
        case 'skipperEnabled': {
          return this.skipperEnabled;
        }
        case 'schedulerEnabled': {
          return this.schedulerEnabled;
        }
        default: {
          LoggerService.error(`Unsupported feature parameter '${feature}'.`);
          return false;
        }
      }
    } else {
      LoggerService.error('Feature string parameter was not there.');
      return false;
    }
  }
}
