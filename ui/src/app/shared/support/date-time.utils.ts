import DateTime from 'luxon/src/datetime.js';

/**
 * Contains common Date/Time related helper methods.
 * For Date/Time functionality Luxon is used.
 *
 * @author Gunnar Hillert
 */
export class DateTimeUtils {

  public static DEFAULT = 'yyyy-MM-dd HH:mm:ss,SSS[Z]';

  /**
   * Returns a date-time formatted string of the passed-in
   * DateTome object.
   *
   * @param dateTime DateTime object
   */
  public static formatAsDateTime(dateTime: DateTime): string {
    return dateTime.toFormat(DateTimeUtils.DEFAULT);
  }
}
