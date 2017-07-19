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

export namespace ApplicationType {
  export function getApplicationTypes() {
    let applicationTypes: String[] = [];
    for(let n in ApplicationType) {
        if(typeof ApplicationType[n] === 'number') {
          console.log('>>>>>>>',n);
          applicationTypes.push(n);
        }
    }
    return applicationTypes;
  }
}