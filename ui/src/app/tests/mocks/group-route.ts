import * as uuidv4 from 'uuid/v4';

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
    const key = 'group-' + uuidv4();
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
    const g = `group-`.length;
    if (str.length !== (36 + g) || str[(8 + g)] !== '-' || str[(13 + g)] !== '-' || str[(18 + g)] !== '-' || str[(23 + g)] !== '-') {
      return false;
    }
    return true;
  }

  group(name) {
    return this._group[name];
  }

}
