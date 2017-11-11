
import { Utils } from './utils';

describe('utils', () => {

  it('encode string with no line breaks', () => {
    expect(Utils.encodeTextToDSL('hoho')).toEqual('"hoho"');
  });

  it('encode string with line breaks', () => {
    expect(Utils.encodeTextToDSL('hoho\nkoko\n')).toEqual('"hoho\\nkoko\\n"');
  });

  it('encode string with quotes', () => {
    expect(Utils.encodeTextToDSL('hoho "koko"')).toEqual('"hoho ""koko"""');
  });

  it('decode string with no line breaks', () => {
    expect(Utils.decodeTextFromDSL('"hoho"')).toEqual('hoho');
  });

  it('decode string with line breaks', () => {
    expect(Utils.decodeTextFromDSL('"hoho\\nkoko\\n"')).toEqual('hoho\nkoko\n');
  });

  it('encode string with quotes', () => {
    expect(Utils.decodeTextFromDSL('"hoho ""koko"""')).toEqual('hoho "koko"');
  });

});
