import { Parser } from './parser';

describe('parser:', () => {

    let parseResult: Parser.ParseResult;
    let line: Parser.Line;
    let nodes: Parser.StreamApp[];
    let node: Parser.StreamApp;
    let error: Parser.Error;

    it('basic', () => {
        parseResult = Parser.parse('time', 'stream');
        expectOneStream(parseResult);
        line = parseResult.lines[0];
        expect(line.errors).toBeNull();
        node = line.nodes[0];
        expect(node.group).toEqual('UNKNOWN_0');
        expect(node.type).toEqual('app');
        expect(node.name).toEqual('time');
        expect(node.options.size).toEqual(0);
        expect(node.optionsranges.size).toEqual(0);
        expect(node.sourceChannelName).toBeNull();
        expect(node.sinkChannelName).toBeNull();
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

    it('channel input with extended character set', () => {
        parseResult = Parser.parse(':foo*/# > log', 'stream');
        expect(parseResult.lines.length).toEqual(1);
        line = parseResult.lines[0];
        nodes = parseResult.lines[0].nodes;
        expect(nodes.length).toEqual(1);
        node = nodes[0];
        expect(node.group).toEqual('UNKNOWN_0');
        expect(node.type).toEqual('sink');
        expect(node.name).toEqual('log');
        expectRange(node.range, 10, 0, 13, 0);
        expectChannels(node, 'foo*/#');
    });

    it('channel input with extended character set 2', () => {
        parseResult = Parser.parse(':*/foo > :*bar/foo#', 'stream');
        expect(parseResult.lines.length).toEqual(1);
        line = parseResult.lines[0];
        nodes = parseResult.lines[0].nodes;
        expect(nodes.length).toEqual(1);
        node = nodes[0];
        expect(node.group).toEqual('UNKNOWN_0');
        expect(node.type).toEqual('processor');
        expect(node.name).toEqual('bridge');
        expectRange(node.range, 7, 0, 8, 0);
        expectChannels(node, '*/foo', '*bar/foo#');
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

    it('long running apps', () => {
      parseResult = Parser.parse('aaa|| bbb', 'stream');
      expect(parseResult.lines.length).toEqual(1);
      line = parseResult.lines[0];
      nodes = parseResult.lines[0].nodes;
      expect(nodes.length).toEqual(2);
      node = nodes[0];
      expect(node.group).toEqual('UNKNOWN_0');
      expect(node.type).toEqual('app');
      expect(node.name).toEqual('aaa');
      expectRange(node.range, 0, 0, 3, 0);
      node = nodes[1];
      expect(node.group).toEqual('UNKNOWN_0');
      expect(node.type).toEqual('app');
      expect(node.name).toEqual('bbb');
      expectRange(node.range, 6, 0, 9, 0);
    });

    it('from source and processor to named destination', () => {
      parseResult = Parser.parse('time | transform > :foo', 'stream');
      expect(parseResult.lines.length).toEqual(1);
      line = parseResult.lines[0];
      nodes = parseResult.lines[0].nodes;
      expect(nodes.length).toEqual(2);
      node = nodes[0];
      expect(node.group).toEqual('UNKNOWN_0');
      expect(node.type).toEqual('source');
      expect(node.name).toEqual('time');
      expectRange(node.range, 0, 0, 4, 0);
      expectChannels(node, null, null);
      node = nodes[1];
      expect(node.group).toEqual('UNKNOWN_0');
      expect(node.type).toEqual('processor');
      expect(node.name).toEqual('transform');
      expectRange(node.range, 7, 0, 16, 0);
      expectChannels(node, null, 'foo');
    });

    it('options', () => {
        parseResult = Parser.parse('time --a=b --c=d | log --e=f', 'stream');
        expect(parseResult.lines.length).toEqual(1);
        line = parseResult.lines[0];
        expect(line.nodes.length).toEqual(2);
        expect(line.nodes[0].options.get('a')).toEqual('b');
        expect(line.nodes[0].options.get('c')).toEqual('d');

        expect(line.nodes[1].options.get('e')).toEqual('f');
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

    it('bridge error', () => {
        parseResult = Parser.parse(':a > :b | bar', 'stream');
        error = parseResult.lines[0].errors[0];
        expect(error.message).toEqual('Expected app name but found \':\'');
        expectRange(error.range, 5, 0, 6, 0);
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
        expect(node.options.get('bb')).toEqual('cc');
        expectRange(node.optionsranges.get('bb'), 5, 0, 12, 0);
    });

    it('error: task with only name', () => {
        parseResult = Parser.parse('aaaa=', 'task');
        error = parseResult.lines[0].errors[0];
        expect(error.message).toEqual('Expected format: name = taskapplication [options]');
        expectRange(error.range, 0, 0, 0, 0);
    });

    it('list of apps - error checking', () => {
        parseResult = Parser.parse(':aaa > fff||bbb', 'stream');
        error = parseResult.lines[0].errors[0];
        expect(error.message).toEqual('Don\'t use || with channels');
        expectRange(error.range, 10, 0, 11, 0);
        parseResult = Parser.parse('aaa||bbb > :zzz', 'stream');
        error = parseResult.lines[0].errors[0];
        expect(error.message).toEqual('Don\'t use || with channels');
        expectRange(error.range, 3, 0, 4, 0);
        parseResult = Parser.parse('aaa | bbb || ccc', 'stream');
        error = parseResult.lines[0].errors[0];
        expect(error.message).toEqual('Don\'t mix | and || in the same stream definition');
        expectRange(error.range, 4, 0, 5, 0);
        parseResult = Parser.parse('aaa|| bbb| ccc', 'stream');
        error = parseResult.lines[0].errors[0];
        expect(error.message).toEqual('Don\'t mix | and || in the same stream definition');
        expectRange(error.range, 3, 0, 4, 0);

        parseResult = Parser.parse('aaa | filter --expression=\'#jsonPath(payload,\'\'$.lang\'\')==\'\'en\'\'\'', 'stream');
        console.log(parseResult);
        expect(parseResult.lines[0].nodes[1].options.get('expression')).
            toEqual('\'#jsonPath(payload,\'\'$.lang\'\')==\'\'en\'\'\'');

        parseResult = Parser.parse('aaa --bbb=ccc||', 'stream');
        error = parseResult.lines[0].errors[0];
        expect(error.message).toEqual('Out of data');
        expectRange(error.range, 15, 0, 16, 0);

        parseResult = Parser.parse('aaa --bbb=\'ccc\'||', 'stream');
        error = parseResult.lines[0].errors[0];
        expect(error.message).toEqual('Out of data');
        expectRange(error.range, 17, 0, 18, 0);
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
        expect(node.options.get('bb')).toEqual('cc');
    });

    it('dotted arg names in stream', () => {
        parseResult = Parser.parse('aaa --bbb.ccc.ddd=eee', 'stream');
        expect(parseResult.lines.length).toEqual(1);
        node = parseResult.lines[0].nodes[0];
        expect(node.name).toEqual('aaa');
        expect(node.options.get('bbb.ccc.ddd')).toEqual('eee');
    });

    it('dotted arg names in task', () => {
        parseResult = Parser.parse('aaa --bbb.ccc.ddd=eee', 'task');
        expect(parseResult.lines.length).toEqual(1);
        node = parseResult.lines[0].nodes[0];
        expect(node.name).toEqual('aaa');
        expect(node.options.get('bbb.ccc.ddd')).toEqual('eee');
    });

    it('literal string arg value', () => {
        parseResult = Parser.parse('aaa --bbb="ccc"', 'stream');
        expect(parseResult.lines.length).toEqual(1);
        node = parseResult.lines[0].nodes[0];
        expect(node.name).toEqual('aaa');
        expect(node.options.get('bbb')).toEqual('"ccc"');
    });

    it('unusual arg value', () => {
        parseResult = Parser.parse('aaa --bbb=*', 'stream');
        // Special tokenization kicks in for argument values, allowing all kinds of things
        expect(parseResult.lines[0].nodes[0].options.get('bbb')).toEqual('*');
    });

    it('error: dotted names 1', () => {
        parseResult = Parser.parse('aaa --aaa .bbb=ccc', 'stream');
        expect(parseResult.lines.length).toEqual(1);
        line = parseResult.lines[0];
        expect(line.errors.length).toEqual(1);
        error = line.errors[0];
        expect(error.message).toEqual('No whitespace allowed in dotted name');
        expectRange(error.range, 6, 0, 7, 0);
    });

    it('error: bad name', () => {
        parseResult = Parser.parse('| = foo', 'stream');
        expect(parseResult.lines.length).toEqual(1);
        line = parseResult.lines[0];
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
        line = parseResult.lines[0];
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
        expect(error.message).toEqual(
            'Label \'aaa\' should be unique but app \'ccc\' (at app position 1) and app \'bbb\' (at app position 0) both use it');
        expectRange(error.range, 11, 0, 19, 0);
    });

    it('error: label required', () => {
        parseResult = Parser.parse('bbb | bbb', 'stream');
        expect(parseResult.lines.length).toEqual(1);
        error = parseResult.lines[0].errors[0];
        expect(error.message)
          .toEqual('App \'bbb\' should be unique within the definition, use a label to differentiate multiple occurrences');
        expectRange(error.range, 6, 0, 9, 0);
    });

    it('error: label required unmanaged stream app', () => {
        parseResult = Parser.parse('bbb|| bbb', 'stream');
        expect(parseResult.lines.length).toEqual(1);
        error = parseResult.lines[0].errors[0];
        expect(error.message)
          .toEqual('App \'bbb\' should be unique within the definition, use a label to differentiate multiple occurrences');
        expectRange(error.range, 6, 0, 9, 0);
    });

    it('error: special chars at start of argument values', () => {
        parseResult = Parser.parse('aaa --bbb= --ccc=ddd', 'stream');
        expect(parseResult.lines.length).toEqual(1);
        error = parseResult.lines[0].errors[0];
        expect(error.message).toEqual('expected argument value');
        expectRange(error.range, 11, 0, 12, 0);

        parseResult = Parser.parse('aaa --bbb=| --ccc=ddd', 'stream');
        expect(parseResult.lines.length).toEqual(1);
        error = parseResult.lines[0].errors[0];
        expect(error.message).toEqual('expected argument value');
        expectRange(error.range, 10, 0, 11, 0);

        parseResult = Parser.parse('aaa --bbb=; --ccc=ddd', 'stream');
        expect(parseResult.lines.length).toEqual(1);
        error = parseResult.lines[0].errors[0];
        expect(error.message).toEqual('expected argument value');
        expectRange(error.range, 10, 0, 11, 0);

        parseResult = Parser.parse('aaa --bbb=> --ccc=ddd', 'stream');
        expect(parseResult.lines.length).toEqual(1);
        error = parseResult.lines[0].errors[0];
        expect(error.message).toEqual('expected argument value');
        expectRange(error.range, 10, 0, 11, 0);
    });

    it('error: rogue option name', () => {
        parseResult = Parser.parse('aaa --|=99 ', 'stream');
        error = parseResult.lines[0].errors[0];
        expect(error.message).toEqual('expected identifier');
        expectRange(error.range, 6, 0, 7, 0);
    });

    it('tap not yet existing stream', () => {
        parseResult = Parser.parse(':stream.time > log', 'stream');
        expect(parseResult.lines.length).toEqual(1);
        expect((<Parser.StreamApp>parseResult.lines[0].nodes[0]).sourceChannelName).toEqual('tap:stream.time');
    });

    it('multiline', () => {
        parseResult = Parser.parse('a=time | log\n:a.time > file', 'stream');
        expect(parseResult.lines.length).toEqual(2);
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
        expect((<Parser.StreamApp>node).sourceChannelName).toEqual('tap:a.time');
    });

    it('error: spaces', () => {
        parseResult = Parser.parse('aaa bbb', 'stream');
        expect(parseResult.lines.length).toEqual(1);
        line = parseResult.lines[0];
        expect(line.errors.length).toEqual(1);
        error = line.errors[0];
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
        expect((<Parser.StreamApp>parseResult.lines[0].nodes[0]).label).toEqual('aaa');
        expect(parseResult.lines[0].nodes[0].name).toEqual('time');
    });

    it('check label unmanaged stream apps', () => {
        parseResult = Parser.parse('aaa|| bbb: aaa', 'stream');
        expect((<Parser.StreamApp>parseResult.lines[0].nodes[0]).label).toBeUndefined();
        expect((<Parser.StreamApp>parseResult.lines[0].nodes[1]).label).toEqual('bbb');
        expect(parseResult.lines[0].nodes[0].name).toEqual('aaa');
        expect(parseResult.lines[0].nodes[1].name).toEqual('aaa');
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
        expect(parseResult.lines[0].nodes[0].options.get('aa')).toEqual('bb');
    });

    function expectOneStream(result: Parser.ParseResult) {
        expect(result.lines.length).toEqual(1);
    }

    function expectRange(range: Parser.Range, startChar: number, startLine: number, endChar: number, endLine: number) {
        expect(range.start.ch).toEqual(startChar);
        expect(range.start.line).toEqual(startLine);
        expect(range.end.ch).toEqual(endChar);
        expect(range.end.line).toEqual(endLine);
    }

    function expectChannels(n: Parser.StreamApp, sourceChannelName?: string, sinkChannelName?: string) {
        if (sourceChannelName) {
            expect(n.sourceChannelName).toEqual(sourceChannelName);
        } else {
            expect(n.sourceChannelName).toBeNull();
        }
        if (sinkChannelName) {
            expect(n.sinkChannelName).toEqual(sinkChannelName);
        } else {
            expect(n.sinkChannelName).toBeNull();
        }
    }

});
