/**
 * The context used by batch store information about the job execution.  This context can be used for partitioning
 * or restarting the job.
 *
 * @author Janne Valkealahti
 */
export class ExecutionContext {

  public dirty: boolean;
  public empty: boolean;
  public values: Map<string, string>;

  constructor(dirty: boolean, empty: boolean, values: Array<Map<string, string>>) {
    this.dirty = dirty;
    this.empty = empty;
    this.values = new Map<string, string>();
    values.forEach(i => {
      i.forEach((value: string, key: string) => {
        this.values.set(key, value);
      });
    });
  }
}
