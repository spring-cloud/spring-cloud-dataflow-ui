/**
 * A service for group route.
 *
 * @author Damien Vitrac
 */
export class MockGroupRouteService {

  public last = null;
  private _group = {};

  constructor() {
  }

  create(args): string {
    const key = `group-${'xxxxx-xxxxx-xxxxx-xxxxx'.replace(/[xy]/g, function (c) {
      const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    })}`;
    this._group[key] = args;
    this.last = {
      key: key,
      args: args
    };
    return key;
  }

  isSimilar(str: string): boolean {
    str = str || '';
    if (!str.startsWith('group-')) {
      return false;
    }
    if (str.length !== 29 || str[11] !== '-' || str[17] !== '-' || str[23] !== '-') {
      return false;
    }
    return true;
  }

  group(name) {
    return this._group[name];
  }

}
