/**
 * Indicator of were the ellipsis indicator is placed for
 * the Truncator component.
 *
 * @author Gunnar Hillert
 */
export class TrailPositionType {
  constructor(
    public id: number,
    public name: string
  ) {
    if (this.name !== 'start' && this.name !== 'end') {
      throw new Error('Unsupported TrailPositionType ' + name);
    }
  }

  static START = new TrailPositionType(1, 'start');
  static END = new TrailPositionType(2, 'end');

}
