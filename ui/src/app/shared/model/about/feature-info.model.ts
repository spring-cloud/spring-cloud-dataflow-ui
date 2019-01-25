import { Serializable } from '../serialization/serializable.model';
import { LoggerService } from '../../services/logger.service';

/**
 * Contains meta data about the supported features.
 *
 * @author Gunnar Hillert
 * @author Damien Vitrac
 */
export class FeatureInfo implements Serializable<FeatureInfo> {

  public streamsEnabled = false;
  public tasksEnabled = false;
  public schedulerEnabled = false;
  public grafanaEnabled = false;


  /**
   * Set the FeatureInfo object to default values.
   */
  public reset() {
    this.streamsEnabled = false;
    this.tasksEnabled = false;
    this.schedulerEnabled = false;
    this.grafanaEnabled = false;
  }

  public deserialize(input) {
    this.streamsEnabled = input['streamsEnabled'] === true;
    this.tasksEnabled = input['tasksEnabled'] === true;
    this.schedulerEnabled = input['schedulerEnabled'] === true;
    this.grafanaEnabled = true; // TODO: input['grafanaEnabled'] ===true;
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
        case 'streamsEnabled': {
          return this.streamsEnabled;
        }
        case 'tasksEnabled': {
          return this.tasksEnabled;
        }
        case 'schedulerEnabled': {
          return this.schedulerEnabled;
        }
        case 'grafanaEnabled': {
          return this.grafanaEnabled;
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
