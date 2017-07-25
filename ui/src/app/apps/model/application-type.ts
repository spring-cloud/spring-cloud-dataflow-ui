/**
 * Enumeration of application types.
 *
 * @author Gunnar Hillert
 *
 */
export enum ApplicationType {
  /**
   * An application type that appears in a stream, at first position.
   */
  source,

  /**
   * An application type that appears in a stream, in middle position.
   */
  processor,

  /**
   * An application type that appears in a stream, in last position.
   */
  sink,

  /**
   * An application type to execute a short-lived process.
   */
  task
}

/**
 * Helper methods for the ApplicationType enum.
 */
export namespace ApplicationType {

  /**
   * Returns an array containing the string representation of all
   * ApplicationType enums.
   */
  export function getApplicationTypes() {
    const applicationTypes: String[] = [];
    for (const enumItem in ApplicationType) {
        if (typeof ApplicationType[enumItem] === 'number') {
          applicationTypes.push(enumItem);
        }
    }
    return applicationTypes;
  }
}
