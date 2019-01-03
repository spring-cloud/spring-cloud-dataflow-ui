import { tokenize } from './tokenizer';
import { Token } from './tokenizer';
import { TokenKind } from './tokenizer';

describe('tokenizer:', () => {

  let tokens: Token[];

  it('basic', () => {
    tokens = tokenize('abc');
    expect(tokens.length).toEqual(1);
    expectToken(tokens[0], TokenKind.IDENTIFIER, 0, 3, 'abc');
  });

  it('more tokens', () => {
    tokens = tokenize('abc | def');
    expect(tokens.length).toEqual(3);
    expectToken(tokens[0], TokenKind.IDENTIFIER, 0, 3, 'abc');
    expectToken(tokens[1], TokenKind.PIPE, 4, 5);
    expectToken(tokens[2], TokenKind.IDENTIFIER, 6, 9, 'def');
  });

  it('other tokens', () => {
    tokens = tokenize(' &  \n   ;');
    expect(tokens.length).toEqual(3);
    expectToken(tokens[0], TokenKind.AND, 1, 2);
    expectToken(tokens[1], TokenKind.NEWLINE, 4, 5);
    expectToken(tokens[2], TokenKind.SEMICOLON, 8, 9);
  });

  it('double pipes', () => {
    tokens = tokenize('abc || def');
    expect(tokens.length).toEqual(3);
    expectToken(tokens[0], TokenKind.IDENTIFIER, 0, 3, 'abc');
    expectToken(tokens[1], TokenKind.DOUBLE_PIPE, 4, 6);
    expectToken(tokens[2], TokenKind.IDENTIFIER, 7, 10, 'def');
  });

  it('single quoted literal', () => {
    tokens = tokenize('\'abc def\'');
    expect(tokens.length).toEqual(1);
    expectToken(tokens[0], TokenKind.LITERAL_STRING, 0, 9, '\'abc def\'');
  });

  it('single quoted literal', () => {
    tokens = tokenize('\'ab\'\'c def\'');
    expect(tokens.length).toEqual(1);
    expectToken(tokens[0], TokenKind.LITERAL_STRING, 0, 11, '\'ab\'\'c def\'');
  });

  it('error: non terminated single quoted literal', () => {
    try {
      tokens = tokenize('\'abc def');
      fail();
    } catch (error) {
      expect(error.msg).toEqual('TokenizationError: non terminating quoted string');
      expect(error.start).toEqual(0);
      expect(error.end).toEqual(8);
    }
  });

  it('double quoted literal', () => {
    tokens = tokenize('"abc def"');
    expect(tokens.length).toEqual(1);
    expectToken(tokens[0], TokenKind.LITERAL_STRING, 0, 9, '"abc def"');
  });

  it('quote values', () => {
    tokens = tokenize('--a=\'bc\'\'d ef\'');
    expect(tokens.length).toEqual(4);
    expectToken(tokens[3], TokenKind.LITERAL_STRING, 4, 14, '\'bc\'\'d ef\'');
  });

  it('double quoted literal', () => {
    tokens = tokenize(' "ab""c def"');
    expect(tokens.length).toEqual(1);
    expectToken(tokens[0], TokenKind.LITERAL_STRING, 1, 12, '"ab""c def"');
  });

  it('error: non terminated double quoted literal', () => {
    try {
      tokens = tokenize('  "abc def');
      fail();
    } catch (error) {
      expect(error.msg).toEqual('TokenizationError: non terminating double quoted string');
      expect(error.start).toEqual(2);
      expect(error.end).toEqual(10);
    }
  });

  it('error: incorrect hyphen usage', () => {
    try {
      tokens = tokenize(' -abc=def');
      fail();
    } catch (error) {
      expect(error.msg).toEqual('TokenizationError: expected two hyphens: \'--\'');
      expect(error.start).toEqual(1);
      expect(error.end).toEqual(2);
    }
  });

  it('error: unexpected char', () => {
    try {
      tokens = tokenize(' (');
      fail();
    } catch (error) {
      expect(error.msg).toEqual('TokenizationError: Unexpected character');
      expect(error.start).toEqual(1);
      expect(error.end).toEqual(2);
    }
  });

  it('channel tokenization', () => {
    tokens = tokenize(':foo');
    expect(tokens.length).toEqual(2);
    expectToken(tokens[0], TokenKind.COLON, 0, 1);
    expectToken(tokens[1], TokenKind.IDENTIFIER, 1, 4, 'foo');
    tokens = tokenize(':foo*');
    expect(tokens.length).toEqual(3);
    expectToken(tokens[0], TokenKind.COLON, 0, 1);
    expectToken(tokens[1], TokenKind.IDENTIFIER, 1, 4, 'foo');
    expectToken(tokens[2], TokenKind.STAR, 4, 5);
    tokens = tokenize(':foo/');
    expect(tokens.length).toEqual(3);
    expectToken(tokens[0], TokenKind.COLON, 0, 1);
    expectToken(tokens[1], TokenKind.IDENTIFIER, 1, 4, 'foo');
    expectToken(tokens[2], TokenKind.SLASH, 4, 5);
    tokens = tokenize(':foo#');
    expect(tokens.length).toEqual(3);
    expectToken(tokens[0], TokenKind.COLON, 0, 1);
    expectToken(tokens[1], TokenKind.IDENTIFIER, 1, 4, 'foo');
    expectToken(tokens[2], TokenKind.HASH, 4, 5);
    tokens = tokenize(':*/#');
    expect(tokens.length).toEqual(4);
    expectToken(tokens[0], TokenKind.COLON, 0, 1);
    expectToken(tokens[1], TokenKind.STAR, 1, 2);
    expectToken(tokens[2], TokenKind.SLASH, 2, 3);
    expectToken(tokens[3], TokenKind.HASH, 3, 4);
  });

  it('option tokenization', () => {
    tokens = tokenize('abc --aaa=bbb');
    expect(tokens.length).toEqual(5);
    expectToken(tokens[0], TokenKind.IDENTIFIER, 0, 3, 'abc');
    expectToken(tokens[1], TokenKind.DOUBLE_MINUS, 4, 6);
    expectToken(tokens[2], TokenKind.IDENTIFIER, 6, 9, 'aaa');
    expectToken(tokens[3], TokenKind.EQUALS, 9, 10);
    expectToken(tokens[4], TokenKind.IDENTIFIER, 10, 13, 'bbb');
  });

  function expectToken(token: Token, tokenKind: TokenKind, start: number, end: number, data?: string) {
    expect(token.kind).toEqual(tokenKind);
    expect(token.start).toEqual(start);
    expect(token.end).toEqual(end);
    if (data) {
      expect(token.data).toEqual(data);
    }
  }
});
