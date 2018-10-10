/**
 * Enumeration of application types.
 *
 * @author Gunnar Hillert
 *
 */
export enum ApplicationType {
  /**
   * An applicatioin type that can have a number of input and output channels
   */
  app,

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
   * Returns an array containing the numric key values of all
   * ApplicationType enums.
   */
  export function getKeys(): number[] {
    return Object.keys(ApplicationType).filter(isNumber).map(value => Number(value));
  }

  function isNumber(element, index, array) {
    return !isNaN(element);
  }
}
