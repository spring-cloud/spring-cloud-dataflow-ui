import { Parser } from './parser';

describe('parser:', () => {

  let parseResult: Parser.ParseResult;
  let line: Parser.Line;
  let nodes: Parser.Node[];
  let node: Parser.Node;
  let error: Parser.Error;

  it('basic', () => {
    parseResult = Parser.parse('time', 'stream');
    expectOneStream(parseResult);
    line = parseResult.lines[0];
    expect(line.errors).toBeNull();
    node = line.nodes[0];
    // [{"group":"UNKNOWN_0","type":"sink","name":"time","options":{},"optionsranges":{},
    //   "range":{"start":{"ch":0,"line":0},"end":{"ch":4,"line":0}},
    //   "sourceChannelName":null,"sinkChannelName":null}]
    expect(node.group).toEqual('UNKNOWN_0');
    expect(node.type).toEqual('source');
    expect(node.name).toEqual('time');
    expectRange(node.range, 0, 0, 4, 0);
    expectChannels(node);
  });

  it('simple valid stream', () => {
    parseResult = Parser.parse('time | log', 'stream');
    expect(parseResult.lines.length).toEqual(1);
    line = parseResult.lines[0];
    nodes = parseResult.lines[0].nodes;
    expect(nodes.length).toEqual(2);
    node = nodes[0];
    expect(node.group).toEqual('UNKNOWN_0');
    expect(node.type).toEqual('source');
    expect(node.name).toEqual('time');
    expectRange(node.range, 0, 0, 4, 0);
    expectChannels(node);
    node = nodes[1];
    expect(node.group).toEqual('UNKNOWN_0');
    expect(node.type).toEqual('sink');
    expect(node.name).toEqual('log');
    expectRange(node.range, 7, 0, 10, 0);
    expectChannels(node);
  });

  it('channel input', () => {
    parseResult = Parser.parse(':foo > log', 'stream');
    expect(parseResult.lines.length).toEqual(1);
    line = parseResult.lines[0];
    nodes = parseResult.lines[0].nodes;
    expect(nodes.length).toEqual(1);
    node = nodes[0];
    expect(node.group).toEqual('UNKNOWN_0');
    expect(node.type).toEqual('sink');
    expect(node.name).toEqual('log');
    expectRange(node.range, 7, 0, 10, 0);
    expectChannels(node, 'foo');
  });

  it('channel output', () => {
    parseResult = Parser.parse('time > :foo', 'stream');
    expect(parseResult.lines.length).toEqual(1);
    line = parseResult.lines[0];
    nodes = parseResult.lines[0].nodes;
    expect(nodes.length).toEqual(1);
    node = nodes[0];
    expect(node.group).toEqual('UNKNOWN_0');
    expect(node.type).toEqual('source');
    expect(node.name).toEqual('time');
    expectRange(node.range, 0, 0, 4, 0);
    expectChannels(node, null, 'foo');
  });

  it('options', () => {
    parseResult = Parser.parse('time --a=b --c=d | log --e=f', 'stream');
    expect(parseResult.lines.length).toEqual(1);
    line = parseResult.lines[0];
    // {"errors":null,"nodes":[
    //   {"group":"UNKNOWN_0","type":"source","name":"time",
    //    "options":{"a":"b","c":"d"},
    //    "optionsranges":
    //     {"a":{"start":{"ch":5,"line":0},"end":{"ch":10,"line":0}},
    //      "c":{"start":{"ch":11,"line":0},"end":{"ch":16,"line":0}}},
    //    "range":{"start":{"ch":0,"line":0},"end":{"ch":4,"line":0}},
    //    "sourceChannelName":null,"sinkChannelName":null},
    //   {"group":"UNKNOWN_0","type":"sink","name":"log",
    //    "options":{"e":"f"},
    //    "optionsranges":{"e":{"start":{"ch":23,"line":0},"end":{"ch":28,"line":0}}},
    //    "range":{"start":{"ch":19,"line":0},"end":{"ch":22,"line":0}},
    //    "sourceChannelName":null,"sinkChannelName":null}]}
    expect(line.nodes.length).toEqual(2);
    expect(line.nodes[0].options['a']).toEqual('b');
    expect(line.nodes[0].options['c']).toEqual('d');

    expect(line.nodes[1].options['e']).toEqual('f');
  });

  it('bridge', () => {
    parseResult = Parser.parse(':a > :b', 'stream');
    expect(parseResult.lines.length).toEqual(1);
    line = parseResult.lines[0];
    nodes = parseResult.lines[0].nodes;
    expect(nodes.length).toEqual(1);
    node = nodes[0];
    expect(node.group).toEqual('UNKNOWN_0');
    expect(node.type).toEqual('processor');
    expect(node.name).toEqual('bridge');
    expectRange(node.range, 3, 0, 4, 0);
    expectChannels(node, 'a', 'b');
  });

  it('named', () => {
    parseResult = Parser.parse('aaaa=time | log', 'stream');
    node = parseResult.lines[0].nodes[0];
    expect(node.group).toEqual('aaaa');
    expect(node.name).toEqual('time');
    expect(node.type).toEqual('source');

    node = parseResult.lines[0].nodes[1];
    expect(node.group).toEqual('aaaa');
    expect(node.name).toEqual('log');
    expect(node.type).toEqual('sink');
  });

  it('multiline', () => {
    parseResult = Parser.parse('time | log\nhdfs | file', 'stream');
    node = parseResult.lines[0].nodes[0];
    expect(node.name).toEqual('time');
    node = parseResult.lines[0].nodes[1];
    expect(node.name).toEqual('log');

    node = parseResult.lines[1].nodes[0];
    expect(node.name).toEqual('hdfs');
    node = parseResult.lines[1].nodes[1];
    expect(node.name).toEqual('file');
    expectRange(node.range, 7, 1, 11, 1);
  });

  it('task', () => {
    parseResult = Parser.parse('aaaa --bb=cc', 'task');
    node = parseResult.lines[0].nodes[0];
    expect(node.name).toEqual('aaaa');
    expect(node.type).toEqual('task');
    expect(node.options['bb']).toEqual('cc');
    expectRange(node.optionsranges['bb'], 5, 0, 12, 0);
  });

  it('error: task with only name', () => {
    parseResult = Parser.parse('aaaa=', 'task');
    error = parseResult.lines[0].errors[0];
    expect(error.message).toEqual('Expected format: name = taskapplication [options]');
    expectRange(error.range, 0, 0, 0, 0);
  });

  it('error: task with extra data', () => {
    parseResult = Parser.parse('aaaa=bbb ccc', 'task');
    error = parseResult.lines[0].errors[0];
    expect(error.message).toEqual('Unexpected data after task definition: ccc');
    expectRange(error.range, 9, 0, 10, 0);
  });

  it('task with a name', () => {
    parseResult = Parser.parse('bbb = aaaa --bb=cc', 'task');
    expect(parseResult.lines.length).toEqual(1);
    node = parseResult.lines[0].nodes[0];
    expect(node.name).toEqual('aaaa');
    expect(node.group).toEqual('bbb');
    expect(node.options['bb']).toEqual('cc');
  });

  it('dotted arg names in stream', () => {
    parseResult = Parser.parse('aaa --bbb.ccc.ddd=eee', 'stream');
    expect(parseResult.lines.length).toEqual(1);
    node = parseResult.lines[0].nodes[0];
    expect(node.name).toEqual('aaa');
    expect(node.options['bbb.ccc.ddd']).toEqual('eee');
  });

  it('dotted arg names in task', () => {
    parseResult = Parser.parse('aaa --bbb.ccc.ddd=eee', 'task');
    expect(parseResult.lines.length).toEqual(1);
    node = parseResult.lines[0].nodes[0];
    expect(node.name).toEqual('aaa');
    expect(node.options['bbb.ccc.ddd']).toEqual('eee');
  });

  it('literal string arg value', () => {
    parseResult = Parser.parse('aaa --bbb="ccc"', 'stream');
    expect(parseResult.lines.length).toEqual(1);
    node = parseResult.lines[0].nodes[0];
    expect(node.name).toEqual('aaa');
    expect(node.options['bbb']).toEqual('"ccc"');
  });

  it('unusual arg value', () => {
    parseResult = Parser.parse('aaa --bbb=*', 'stream');
    // Special tokenization kicks in for argument values, allowing all kinds of things
    expect(parseResult.lines[0].nodes[0].options['bbb']).toEqual('*');
  });

  it('error: dotted names 1', () => {
    parseResult = Parser.parse('aaa --aaa .bbb=ccc', 'stream');
    expect(parseResult.lines.length).toEqual(1);
    const line: Parser.Line = parseResult.lines[0];
    expect(line.errors.length).toEqual(1);
    error = line.errors[0];
    expect(error.message).toEqual('No whitespace allowed in dotted name');
    expectRange(error.range, 6, 0, 7, 0);
  });

  it('error: bad name', () => {
    parseResult = Parser.parse('| = foo', 'stream');
    expect(parseResult.lines.length).toEqual(1);
    const line: Parser.Line = parseResult.lines[0];
    expect(line.errors.length).toEqual(1);
    error = line.errors[0];
    expect(error.message).toEqual('Illegal name \'|\'');
    expectRange(error.range, 0, 0, 1, 0);
  });

  it('error: bad app', () => {
    parseResult = Parser.parse('|', 'stream');
    expect(parseResult.lines.length).toEqual(1);
    error = parseResult.lines[0].errors[0];
    expect(error.message).toEqual('Expected app name but found \'|\'');
    expectRange(error.range, 0, 0, 1, 0);
  });

  it('error: bad label', () => {
    parseResult = Parser.parse('aaa : bbb', 'stream');
    expect(parseResult.lines.length).toEqual(1);
    const line: Parser.Line = parseResult.lines[0];
    error = line.errors[0];
    expect(error.message).toEqual('No whitespace allowed between label name and colon');
    expectRange(error.range, 3, 0, 4, 0);
  });

  it('error: dotted names 2', () => {
    parseResult = Parser.parse('aaa --aaa. bbb=ccc', 'stream');
    expect(parseResult.lines.length).toEqual(1);
    error = parseResult.lines[0].errors[0];
    expect(error.message).toEqual('No whitespace allowed in dotted name');
    expectRange(error.range, 6, 0, 7, 0);
  });

  it('error: dotted destination', () => {
    parseResult = Parser.parse('aaa .bbb > log', 'stream');
    expect(parseResult.lines.length).toEqual(1);
    error = parseResult.lines[0].errors[0];
    expect(error.message).toEqual('Unexpected data after stream definition: .');
    expectRange(error.range, 4, 0, 5, 0);
  });

  it('error: incorrect destination start char', () => {
    parseResult = Parser.parse('time > |foo', 'stream');
    expect(parseResult.lines.length).toEqual(1);
    error = parseResult.lines[0].errors[0];
    expect(error.message).toEqual('Destination must start with a \':\'');
    expectRange(error.range, 7, 0, 8, 0);
  });

  it('error: incomplete destination', () => {
    parseResult = Parser.parse('aaa.', 'stream');
    expect(parseResult.lines.length).toEqual(1);
    error = parseResult.lines[0].errors[0];
    expect(error.message).toEqual('Unexpected data after stream definition: .');
    expectRange(error.range, 3, 0, 4, 0);
  });

  it('error: double label usage', () => {
    parseResult = Parser.parse('aaa: bbb | aaa: ccc', 'stream');
    expect(parseResult.lines.length).toEqual(1);
    error = parseResult.lines[0].errors[0];
    expect(error.message).toEqual('Label \'aaa\' should be unique but app \'ccc\' (at app position 1) and app \'bbb\' (at app position 0) both use it');
    expectRange(error.range, 11, 0, 19, 0);
  });

  it('error: label required', () => {
    parseResult = Parser.parse('bbb | bbb', 'stream');
    expect(parseResult.lines.length).toEqual(1);
    error = parseResult.lines[0].errors[0];
    expect(error.message).toEqual('App \'bbb\' should be unique within the stream, use a label to differentiate multiple occurrences');
    expectRange(error.range, 6, 0, 9, 0);
  });

  it('tap not yet existing stream', () => {
    parseResult = Parser.parse(':stream.time > log', 'stream');
    expect(parseResult.lines.length).toEqual(1);
    // {"lines":[{"errors":null,"nodes":[{"group":"UNKNOWN_0","type":"sink","name":"log","options":{},"optionsranges":{},"range":{"start":{"ch":15,"line":0},"end":{"ch":18,"line":0}},"sourceChannelName":"tap:stream.time","sinkChannelName":null}]}]}
    expect(parseResult.lines[0].nodes[0].sourceChannelName).toEqual('tap:stream.time');
  });

  it('multiline', () => {
    parseResult = Parser.parse('a=time | log\n:a.time > file', 'stream');
    expect(parseResult.lines.length).toEqual(2);
    // {"lines":[
    //   {"errors":null,"nodes":[
    //    {"group":"a","type":"source","name":"time","options":{},"optionsranges":{},"range":{"start":{"ch":2,"line":0},"end":{"ch":6,"line":0}},"sourceChannelName":null,"sinkChannelName":null},
    //    {"group":"a","type":"sink","name":"log","options":{},"optionsranges":{},"range":{"start":{"ch":9,"line":0},"end":{"ch":12,"line":0}},"sourceChannelName":null,"sinkChannelName":null}]},
    //   {"errors":null,"nodes":[
    //    {"group":"UNKNOWN_1","type":"sink","name":"file","options":{},"optionsranges":{},"range":{"start":{"ch":10,"line":1},"end":{"ch":14,"line":1}},"sourceChannelName":"tap:a.time","sinkChannelName":null}]}]}
    line = parseResult.lines[0];
    node = line.nodes[0];
    expect(node.name).toEqual('time');
    node = line.nodes[1];
    expect(node.name).toEqual('log');
    expectRange(node.range, 9, 0, 12, 0);
    line = parseResult.lines[1];
    node = line.nodes[0];
    expect(node.name).toEqual('file');
    expectRange(node.range, 10, 1, 14, 1);
    expect(node.sourceChannelName).toEqual('tap:a.time');
  });

  it('error: spaces', () => {
    parseResult = Parser.parse('aaa bbb', 'stream');
    expect(parseResult.lines.length).toEqual(1);
    line = parseResult.lines[0];
    expect(line.errors.length).toEqual(1);
    error = line.errors[0];
    // {"errors":[{"accurate":true,"message":"Unexpected data after stream definition: bbb",
    //  "range":{"start":{"ch":4,"line":0},"end":{"ch":5,"line":0}}}]}
    expect(error.message).toEqual('Unexpected data after stream definition: bbb');
    expectRange(error.range, 4, 0, 5, 0);
  });

  it('error: out-of-data', () => {
    parseResult = Parser.parse('aaa --a', 'stream');
    expect(parseResult.lines.length).toEqual(1);
    line = parseResult.lines[0];
    expect(line.errors.length).toEqual(1);
    error = line.errors[0];
    expect(error.message).toEqual('Out of data');
    expectRange(error.range, 7, 0, 8, 0);
  });

  it('error: no data', () => {
    parseResult = Parser.parse('', 'stream');
    expect(parseResult.lines[0].nodes.length).toEqual(0);
    expect(parseResult.lines[0].errors.length).toEqual(0);
  });

  it('error: whitespace in destination', () => {
    parseResult = Parser.parse('aaa > : aa', 'stream');
    expect(parseResult.lines.length).toEqual(1);
    line = parseResult.lines[0];
    expect(line.errors.length).toEqual(1);
    error = line.errors[0];
    expect(error.message).toEqual('No whitespace allowed in destination');
    expectRange(error.range, 7, 0, 8, 0);
  });

  it('error: whitespace in destination 2', () => {
    parseResult = Parser.parse('aaa > :aa. bb', 'stream');
    expect(parseResult.lines.length).toEqual(1);
    line = parseResult.lines[0];
    expect(line.errors.length).toEqual(1);
    error = line.errors[0];
    expect(error.message).toEqual('No whitespace allowed in destination');
    expectRange(error.range, 10, 0, 11, 0);
  });

  it('error: whitespace in destination 3', () => {
    parseResult = Parser.parse('aaa > :aa. ', 'stream');
    expect(parseResult.lines.length).toEqual(1);
    line = parseResult.lines[0];
    expect(line.errors.length).toEqual(1);
    error = line.errors[0];
    expect(error.message).toEqual('Out of data - incomplete destination');
    expectRange(error.range, 9, 0, 10, 0);
  });

  it('error: incomplete destination', () => {
    parseResult = Parser.parse('aaa > :', 'stream');
    expect(parseResult.lines.length).toEqual(1);
    line = parseResult.lines[0];
    expect(line.errors.length).toEqual(1);
    error = line.errors[0];
    expect(error.message).toEqual('Out of data - incomplete destination');
    expectRange(error.range, 6, 0, 7, 0);
  });

  it('error: incomplete destination', () => {
    parseResult = Parser.parse(': > log', 'stream');
    expect(parseResult.lines.length).toEqual(1);
    line = parseResult.lines[0];
    expect(line.errors.length).toEqual(1);
    error = line.errors[0];
    expect(error.message).toEqual('No whitespace allowed in destination');
    expectRange(error.range, 1, 0, 2, 0);
  });

  it('check label', () => {
    parseResult = Parser.parse('aaa: time | log', 'stream');
    expect(parseResult.lines[0].nodes[0].label).toEqual('aaa');
    expect(parseResult.lines[0].nodes[0].name).toEqual('time');
  });

  it('error: bad options 1', () => {
    parseResult = Parser.parse('aaa --', 'stream');
    expect(parseResult.lines.length).toEqual(1);
    line = parseResult.lines[0];
    expect(line.errors.length).toEqual(1);
    error = line.errors[0];
    expect(error.message).toEqual('Out of data');
    expectRange(error.range, 6, 0, 7, 0);
  });

  it('error: bad options 2', () => {
    parseResult = Parser.parse('aaa -- bbb', 'stream');
    expect(parseResult.lines.length).toEqual(1);
    line = parseResult.lines[0];
    expect(line.errors.length).toEqual(1);
    error = line.errors[0];
    expect(error.message).toEqual('No whitespace allowed after -- but before option name');
    expectRange(error.range, 6, 0, 7, 0);
  });

  it('error: bad options 3', () => {
    parseResult = Parser.parse('aaa --aaa =', 'stream');
    expect(parseResult.lines.length).toEqual(1);
    line = parseResult.lines[0];
    expect(line.errors.length).toEqual(1);
    error = line.errors[0];
    expect(error.message).toEqual('No whitespace allowed before equals');
    expectRange(error.range, 9, 0, 10, 0);
  });

  it('error: bad options 4', () => {
    parseResult = Parser.parse('aaa --aaa= bbb', 'stream');
    expect(parseResult.lines.length).toEqual(1);
    line = parseResult.lines[0];
    expect(line.errors.length).toEqual(1);
    error = line.errors[0];
    expect(error.message).toEqual('No whitespace allowed before option value');
    expectRange(error.range, 10, 0, 11, 0);
  });

  it('hyphenated name', () => {
    parseResult = Parser.parse('aaa--aaa= bbb', 'stream');
    expect(parseResult.lines[0].nodes[0].group).toEqual('aaa--aaa');
    expect(parseResult.lines[0].errors).toBeNull();
    expect(parseResult.lines[0].nodes[0].name).toEqual('bbb');
  });

  it('hyphenated app name', () => {
    parseResult = Parser.parse('aaa--aaa --aa=bb', 'stream');
    expect(parseResult.lines[0].errors).toBeNull();
    expect(parseResult.lines[0].nodes[0].name).toEqual('aaa--aaa');
    expect(parseResult.lines[0].nodes[0].options['aa']).toEqual('bb');
  });

  // ---
  function expectOneStream(result: Parser.ParseResult) {
    expect(result.lines.length).toEqual(1);
  }

  function expectRange(range: Parser.Range, startChar: number, startLine: number, endChar: number, endLine: number) {
    expect(range.start.ch).toEqual(startChar);
    expect(range.start.line).toEqual(startLine);
    expect(range.end.ch).toEqual(endChar);
    expect(range.end.line).toEqual(endLine);
  }

  function expectChannels(node: Parser.Node, sourceChannelName?: string, sinkChannelName?: string) {
    if (sourceChannelName) {
      expect(node.sourceChannelName).toEqual(sourceChannelName);
    } else {
      expect(node.sourceChannelName).toBeNull();
    }
    if (sinkChannelName) {
      expect(node.sinkChannelName).toEqual(sinkChannelName);
    } else {
      expect(node.sinkChannelName).toBeNull();
    }
  }

});
