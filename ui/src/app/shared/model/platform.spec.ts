/**
 * Test {@link Platform} model.
 *
 * @author Damien Vitrac
 */

import { Platform } from './platform';

describe('Platform', () => {

  it('Platform simple deserialize', () => {
    const m = Platform.fromJSON({
      name: 'foobar',
      type: 'foo',
      description: 'bar',
    });
    expect(m.name).toEqual('foobar');
    expect(m.type).toEqual('foo');
    expect(m.description).toEqual('bar');
  });

});
