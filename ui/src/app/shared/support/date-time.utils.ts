import { Moment } from 'moment';

/**
 * Contains common Date/Time related helper methods.
 * For Date/Time functionality Moment.js is used.
 *
 * @author Gunnar Hillert
 */
export class DateTimeUtils {

  /**
   * Returns a date-time formatted string of the passed-in
   * Moment.js object.
   *
   * @param dateTime Moment.js object
   */
  public static formatAsDateTime(dateTime: Moment): string {
    return dateTime.format('Y-MM-DD HH:mm:ss,SSS Z');
  }
}
