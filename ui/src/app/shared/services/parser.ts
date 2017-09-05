/*
 * Copyright 2016-2017 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { TokenKind } from './tokenizer';
import { Token } from './tokenizer';
import { tokenize } from './tokenizer';

interface Ugly {
    group: string;
    label?: string;
    type: string;
    name: string;
    range: Parser.Range;
    options?;
    optionsranges?: Parser.Range[];
    sourceChannelName?: string;
    sinkChannelName?: string;
}
/**
 * Parse a textual stream definition.
 *
 * @author Andy Clement
 * @author Alex Boyko
 */
class InternalParser {

    private lines: Parser.Line[] = [];
    private mode: string; // stream or task, defaults to stream
    private text: string;
    private tokenStream: Token[];
    private tokenStreamPointer: number;
    private tokenStreamLength: number;
    private textlines: string[];

    constructor(definitionsText: string, mode?: string) {
        this.mode = mode;
        this.textlines = definitionsText.split('\n');
    }

    private tokenListToStringList(tokens, delimiter) {
        if (tokens.length === 0) {
            return '';
        }
        let result = '';
        for (let t = 0; t < tokens.length; t++) {
            if (t > 0) {
                result = result + delimiter;
            }
            result = result + tokens[t].data;
        }
        return result;
    }

    private isKind(token: Token, expected: TokenKind): boolean {
        return token.kind === expected;
    }

    private isNextTokenAdjacent(): boolean {
        if (this.tokenStreamPointer >= this.tokenStreamLength) {
            return false;
        }
        const last = this.tokenStream[this.tokenStreamPointer - 1];
        const next = this.tokenStream[this.tokenStreamPointer];
        return next.start === last.end;
    }

    private moreTokens(): boolean {
        return this.tokenStreamPointer < this.tokenStreamLength;
    }

    private nextToken(): Token {
        if (this.tokenStreamPointer >= this.tokenStreamLength) {
            throw {'msg': 'Out of data', 'start': this.text.length};
        }
        return this.tokenStream[this.tokenStreamPointer++];
    }

    private peekAtToken(): Token {
        if (this.tokenStreamPointer >= this.tokenStreamLength) {
            return null;
        }
        return this.tokenStream[this.tokenStreamPointer];
    }

    private lookAhead(distance: number, desiredTokenKind: TokenKind) {
        if ((this.tokenStreamPointer + distance) >= this.tokenStreamLength) {
            return false;
        }
        const t = this.tokenStream[this.tokenStreamPointer + distance];
        if (t.kind === desiredTokenKind) {
            return true;
        }
        return false;
    }

    private noMorePipes(tp?: number): boolean {
        if (!tp) {
            tp = this.tokenStreamPointer;
        }
        while (tp < this.tokenStreamLength) {
            if (this.tokenStream[tp++].kind === TokenKind.PIPE) {
                return false;
            }
        }
        return true;
    }

    private peekToken(desiredTokenKind: TokenKind, consumeIfMatched?: boolean): boolean {
        if (!consumeIfMatched) {
            consumeIfMatched = false;
        }
        if (!this.moreTokens()) {
            return false;
        }
        const t = this.peekAtToken();
        if (t.kind === desiredTokenKind) {
            if (consumeIfMatched) {
                this.tokenStreamPointer++;
            }
            return true;
        } else {
            return false;
        }
    }

    private eatToken(expectedKind: TokenKind): Token {
        const t = this.nextToken();
        if (t === null) {
            throw {'msg': 'Out of data', 'start': this.text.length};
        }
        if (!this.isKind(t, expectedKind)) {
            // TODO better text for the ids
            throw {'msg': 'Token not of expected kind (Expected ' + expectedKind + ' found ' + t.kind + ')', 'start': t.start};
        }
        return t;
    }

    // A destination reference is of the form ':'IDENTIFIER['.'IDENTIFIER]*
    private eatDestinationReference(tapAllowed: boolean): Parser.DestinationReference {
        const nameComponents = [];
        let t;
        let currentToken;
        const firstToken = this.nextToken();
        if (firstToken.kind !== TokenKind.COLON) {
            throw {'msg': 'Destination must start with a \':\'', 'start': firstToken.start, 'end': firstToken.end};
        }
        if (!this.isNextTokenAdjacent()) {
        t = this.peekAtToken();
            if (t) {
                throw {'msg': 'No whitespace allowed in destination', 'start': firstToken.end, 'end': t.start};
            } else {
                throw {'msg': 'Out of data - incomplete destination', 'start': firstToken.start};
            }
        }
        nameComponents.push(this.eatToken(TokenKind.IDENTIFIER)); // the non-optional identifier
        while (this.isNextTokenAdjacent() && this.peekToken(TokenKind.DOT)) {
            currentToken = this.eatToken(TokenKind.DOT);
            if (!this.isNextTokenAdjacent()) {
                t = this.peekAtToken();
                if (t) {
                    throw {'msg': 'No whitespace allowed in destination', 'start': currentToken.end, 'end': t.start};
                } else {
                    throw {'msg': 'Out of data - incomplete destination', 'start': currentToken.start};
                }
            }
            nameComponents.push(this.eatToken(TokenKind.IDENTIFIER));
        }
        let type = null;
        // TODO this does not cope with dotted stream names...
        if (nameComponents.length < 2 || !tapAllowed) {
            type = 'destination';
        } else {
            type = 'tap';
        }
        const endpos = nameComponents[nameComponents.length - 1].end;
        const destinationObject: Parser.DestinationReference = {
            type: type,
            start: firstToken.start,
            end: endpos,
            name: (type === 'tap' ? 'tap:' : '') + this.tokenListToStringList(nameComponents, '.')
        };
        return destinationObject;
    }

    // return true if the specified tokenpointer appears to be pointing at a channel
    private looksLikeChannel(tp?: number): boolean {
        if (!tp) {
            tp = this.tokenStreamPointer;
        }
        if (this.moreTokens() && this.isKind(this.tokenStream[tp], TokenKind.COLON)) {
            return true;
        }
        return false;
    }

    // identifier ':' identifier >
    // tap ':' identifier ':' identifier '.' identifier >
    private maybeEatSourceChannel(): Parser.ChannelReference {
        let gtBeforePipe = false;
        // Seek for a GT(>) before a PIPE(|)
        for (let tp = this.tokenStreamPointer; tp < this.tokenStreamLength; tp++) {
            const t = this.tokenStream[tp];
            if (t.kind === TokenKind.GT) {
                gtBeforePipe = true;
                break;
            } else if (t.kind === TokenKind.PIPE) {
                break;
            }
        }
        if (!gtBeforePipe || !this.looksLikeChannel(this.tokenStreamPointer)) {
            return null;
        }

        const channel = this.eatDestinationReference(true);
        const gt = this.eatToken(TokenKind.GT);
        return {'channel': channel, 'end': gt.end};
    }

    // '>' ':' identifier
    private maybeEatSinkChannel() {
        let sinkChannelNode = null;
        if (this.peekToken(TokenKind.GT)) {
            const gt = this.eatToken(TokenKind.GT);
            const channelNode = this.eatDestinationReference(false);
            sinkChannelNode = {'channel': channelNode, 'start': gt.start};
        }
        return sinkChannelNode;
    }

    /**
     * Return the concatenation of the data of many tokens.
     */
    private data(many): string {
        let result = '';
        for (let i = 0; i < many.length; i++) {
            const t = many[i];
            result = result + (t.data ? t.data : t.kind);
        }
        return result;
    }

    // argValue: identifier | literal_string
    private eatArgValue() {
        const t = this.nextToken();
        let argValue = null;
        if (this.isKind(t, TokenKind.IDENTIFIER)) {
            argValue = t.data;
        } else if (this.isKind(t, TokenKind.LITERAL_STRING)) {
            argValue = t.data;
            // var quotesUsed = t.data.substring(0, 1);
            // argValue = t.data.substring(1, t.data.length - 1).replace(quotesUsed + quotesUsed, quotesUsed);
        } else {
            throw {'msg': 'expected argument value', 'start': t.start};
        }
        return argValue;
    }

    /**
     * Consumes and returns (identifier [DOT identifier]*) as long as they're adjacent.
     *
     * @param error the kind of error to report if input is ill-formed
     */
    private eatDottedName(errorMessage?: string): Token[] {
        if (!errorMessage) {
            errorMessage = 'not expected token';
        }
        const result: Token[] = [];
        const name = this.nextToken();
        if (!this.isKind(name, TokenKind.IDENTIFIER)) {
            throw {'msg': errorMessage, 'start': name.start};
        }
        result.push(name);
        while (this.peekToken(TokenKind.DOT)) {
            if (!this.isNextTokenAdjacent()) {
                throw {'msg': 'No whitespace allowed in dotted name', 'start': name.start};
            }
            result.push(this.nextToken()); // consume dot
            if (this.peekToken(TokenKind.IDENTIFIER) && !this.isNextTokenAdjacent()) {
                throw {'msg': 'No whitespace allowed in dotted name', 'start': name.start};
            }
            result.push(this.eatToken(TokenKind.IDENTIFIER));
        }
        return result;
    }

    // appArguments : DOUBLE_MINUS identifier(name) EQUALS identifier(value)
    private maybeEatAppArgs() {
        let args = null;
        // TODO not entirely sure this first problem can happen since dashes can now be in the app names
        if (this.peekToken(TokenKind.DOUBLE_MINUS) && this.isNextTokenAdjacent()) {
            throw {'msg': 'Expected whitespace after app name before option', 'start': this.peekAtToken().start};
        }
        while (this.peekToken(TokenKind.DOUBLE_MINUS)) {
            const dashDash = this.nextToken(); // skip the '--'
            if (this.peekToken(TokenKind.IDENTIFIER) && !this.isNextTokenAdjacent()) {
                throw {'msg': 'No whitespace allowed after -- but before option name',
                       'start': dashDash.end, 'end': this.peekAtToken().start};
            }
            const argNameComponents = this.eatDottedName();
            if (this.peekToken(TokenKind.EQUALS) && !this.isNextTokenAdjacent()) {
                throw {'msg': 'No whitespace allowed before equals', 'start': argNameComponents[argNameComponents.length - 1].end,
                       'end': this.peekAtToken().start};
            }
            const equalsToken = this.eatToken(TokenKind.EQUALS);
            if (this.peekToken(TokenKind.IDENTIFIER) && !this.isNextTokenAdjacent()) {
                throw {'msg': 'No whitespace allowed before option value', 'start': equalsToken.end, 'end': this.peekAtToken().start};
            }
            // Process argument value:
            const t = this.peekAtToken();
            const argValue = this.eatArgValue();
            if (args === null) {
                args = [];
            }
            args.push({'name': this.data(argNameComponents), 'value': argValue, 'start': dashDash.start, 'end': t.end});
        }
        return args;
    }

    // app: [label':']? identifier (appArguments)*
    private eatApp(): Parser.AppNode {
        let label = null;
        let name = this.nextToken();
        if (!this.isKind(name, TokenKind.IDENTIFIER)) {
            throw {'msg': 'Expected app name but found \'' + this.toString(name) + '\'', 'start': name.start, 'end': name.end};
        }
        if (this.peekToken(TokenKind.COLON)) {
            if (!this.isNextTokenAdjacent()) {
                throw {'msg': 'No whitespace allowed between label name and colon', 'start': name.end, 'end': this.peekAtToken().start};
            }
            this.nextToken(); // swallow colon
            label = name;
            name = this.eatToken(TokenKind.IDENTIFIER);
        }
        const appNameToken = name;
        const args = this.maybeEatAppArgs();
        const startpos = label !== null ? label.start : appNameToken.start;
        const appNode: Parser.AppNode = {'name': appNameToken.data, 'start': startpos, 'end': appNameToken.end};
        if (label) {
            appNode.label = label.data;
        }
        if (args) {
            appNode.options = args;
        }

        return appNode;
    }

    // appList: app (| app)*
    // A stream may end in a app (if it is a sink) or be followed by
    // a sink channel.
    private eatAppList(): Parser.AppNode[] {
        const appNodes: Parser.AppNode[] = [];
        appNodes.push(this.eatApp());
        while (this.moreTokens()) {
            const t = this.peekAtToken();
            if (this.isKind(t, TokenKind.PIPE)) {
                this.nextToken();
                appNodes.push(this.eatApp());
            } else {
                // might be followed by sink channel
                break;
            }
        }
        return appNodes;
    }

    private toString(token): string {
        if (token.data) {
            return token.data;
        }
        if (token.kind) {
            return token.kind;
        }
        return JSON.stringify(token);
    }

    // (name =)
    private maybeEatName() {
        let name = null;
        if (this.lookAhead(1, TokenKind.EQUALS)) {
            if (this.peekToken(TokenKind.IDENTIFIER)) {
                name = this.eatToken(TokenKind.IDENTIFIER);
                this.nextToken(); // skip '='
            } else {
                throw {'msg': 'Illegal name \'' + this.toString(this.peekAtToken()) + '\'', 'start': this.peekAtToken().start};
            }
        }
        return name;
    }

    private outOfData() {
        return this.peekAtToken() === null;
    }

    private recordError(node, error: Parser.Error) {
        if (!node.errors) {
            node.errors = [];
        }
        node.errors.push(error);
    }

    private eatTaskDefinition(lineNum): Parser.TaskNode {
        const taskNode: Parser.TaskNode = {};
        const taskName = this.maybeEatName();
        if (!taskName) {
            this.recordError(taskNode, {
                'message': 'Expected format: name = taskapplication [options]',
                'range': {'start': {'ch': 0, 'line': lineNum},
                            'end': {'ch': 0, 'line': lineNum}}
            });
        } else {
            taskNode.name = taskName.data;
            taskNode.namerange = {
                'start': {'ch': taskName.start, 'line': lineNum},
                'end': {'ch': taskName.end, 'line': lineNum}};
            if (this.outOfData()) {
                this.recordError(taskNode, {
                    'message': 'Expected format: name = taskapplication [options]',
                    'range': {'start': {'ch': 0, 'line': lineNum},
                            'end': {'ch': 0, 'line': lineNum}
                }});
                return taskNode;
            }
        }
        taskNode.app = this.eatApp();
        if (this.moreTokens()) {
            const t = this.peekAtToken();
            throw {'msg': 'Unexpected data after task definition: ' + this.toString(t), 'start': t.start};
        }
        return taskNode;
    }

    private eatStream(lineNum: number): Parser.StreamDef {
        const streamNode: Parser.StreamDef = {};

        const streamName = this.maybeEatName();
        if (streamName) {
            streamNode.name = streamName.data;
        }

        const sourceChannelNode = this.maybeEatSourceChannel();

        // the construct queue:foo > topic:bar is a source then a sink with no app. Special handling for
        // that is right here
        let bridge = false;
        if (sourceChannelNode) { // so if we are just after a '>'
            streamNode.sourceChannel = sourceChannelNode;
            if (this.looksLikeChannel() && this.noMorePipes()) {
                bridge = true;
            }
        }

        // Are we out of data? If so return what we have but include errors.
        if (this.outOfData()) {
            this.recordError(streamNode, {'message': 'unexpectedly out of data',
                'range': {'start': {'ch': this.text.length, 'line': lineNum},
                        'end': {'ch': this.text.length + 1, 'line': lineNum}}});
            return streamNode;
        }

        let appNodes = null;
        if (bridge) {
            // Create a bridge app to hang the source/sink channels off
            this.tokenStreamPointer--; // Rewind so we can nicely eat the sink channel
            appNodes = [];
            appNodes.push({'name': 'bridge', 'start': this.peekAtToken().start, 'end': this.peekAtToken().end});
        } else {
            appNodes = this.eatAppList();
        }
        streamNode.apps = appNodes;
        const sinkChannelNode = this.maybeEatSinkChannel();

        // Further data is an error
        if (this.moreTokens()) {
            const t = this.peekAtToken();
            throw {'msg': 'Unexpected data after stream definition: ' + this.toString(t), 'start': t.start};
        }
        if (sinkChannelNode) {
            streamNode.sinkChannel = sinkChannelNode;
        }
        return streamNode;
    }

    // TODO switch to the var x= (function() {... return yyy; })(); model
    // mode may be 'task' or 'stream' - will default to 'stream'
    public parse() {
        let start, end, errorToRecord;
        let line: Parser.Line;
        for (let lineNumber = 0; lineNumber < this.textlines.length; lineNumber++) {
            try {
                line = {};
                line.errors = null;

                this.text = this.textlines[lineNumber];
                if (this.text.trim().length === 0) {
                    this.lines.push({'nodes': [], 'errors': []});
                    continue;
                }
                console.log('JSParse: processing ' + this.text);
                this.tokenStream = tokenize(this.text);
                console.log('JSParse: tokenized to ' + JSON.stringify(this.tokenStream));
                this.tokenStreamPointer = 0;
                this.tokenStreamLength = this.tokenStream.length;
                // time | log
                // [{"token":0,"data":"time","start":0,"end":4},
                //  {"token":4,"start":5,"end":6},
                //  {"token":0,"data":"log","start":7,"end":10}]

                let errorsToProcess: Parser.Error[] = [];
                const success = [];
                let app;
                let option;
                let options;
                let optionsranges;
                if (this.mode === 'task') {
                    const taskdef = this.eatTaskDefinition(lineNumber);
                    // $log.info('JSParse: parsed to task definition: '+JSON.stringify(taskdef));
                    app = taskdef.app;
                    if (app) {
                        options = {};
                        optionsranges = {};
                        if (app.options) {
                            for (let o1 = 0; o1 < app.options.length; o1++) {
                                option = app.options[o1];
                                options[option.name] = option.value;
                                optionsranges[option.name] = {
                                     'start': {'ch': option.start, 'line': lineNumber},
                                     'end': {'ch': option.end, 'line': lineNumber}};
                            }
                        }
                        const taskObject: Parser.ParsedTask = {
                            group: taskdef.name,
                            grouprange: taskdef.namerange,
                            type: 'task',
                            name: app.name,
                            range: {'start': {'ch': app.start, 'line': lineNumber}, 'end': {'ch': app.end, 'line': lineNumber}},
                            options: options,
                            optionsranges: optionsranges
                        };
                        success.push(taskObject);
                    }
                    if (taskdef.errors) {
                        errorsToProcess = taskdef.errors;
                    }
                } else {
                    const streamdef = this.eatStream(lineNumber);
                    console.log('JSParse: parsed to stream definition: ' + JSON.stringify(streamdef));
                    // streamDef = {"apps":[{"name":"time","start":0,"end":4},{"name":"log","start":7,"end":10}]}

                    // {"lines":[{"errors":null,"success":
                    // [{"group":"UNKNOWN_1","label":"time","type":"source","name":"time","options":{},
                    //   "sourceChannelName":null,"sinkChannelName":null},{"group":"UNKNOWN_1","label":"log","type":"sink","name":"log",
                    //   "options":{},"sourceChannelName":null,"sinkChannelName":null}]
                    // }],"links":[]}

                    const streamName = streamdef.name ? streamdef.name : 'UNKNOWN_' + lineNumber;
                    if (streamdef.apps) {
                        const alreadySeen = {};
                        for (let m = 0; m < streamdef.apps.length; m++) {
                            let expectedType = 'processor';
                            if (streamdef.sourceChannel && streamdef.sinkChannel && m === 0) {
                                // it is a bridge and so a processor
                            } else {
                                if (m === 0 && !streamdef.sourceChannel) {
                                    expectedType = 'source';
                                } else if (m === (streamdef.apps.length - 1)) {
                                    expectedType = 'sink';
                                }
                            }
                            let sourceChannelName = null;
                            if (m === 0 && streamdef.sourceChannel) {
                                sourceChannelName = streamdef.sourceChannel.channel.name;
                            }
                            let sinkChannelName = null;
                            if (m === streamdef.apps.length - 1 && streamdef.sinkChannel) {
                                sinkChannelName = streamdef.sinkChannel.channel.name;
                            }
                            app = streamdef.apps[m];

                            options = {};
                            optionsranges = {};
                            if (app.options) {
                                for (let o2 = 0; o2 < app.options.length; o2++) {
                                    option = app.options[o2];
                                    options[option.name] = option.value;
                                    optionsranges[option.name] = {'start': {'ch': option.start, 'line': lineNumber},
                                      'end': {'ch': option.end, 'line': lineNumber}};
                                }
                            }
                            const uglyObject: Ugly = {
                                group: streamName,
                                type: expectedType,
                                name: app.name,
                                options: options,
                                optionsranges: optionsranges,
                                range: {'start': {'ch': app.start, 'line': lineNumber}, 'end': {'ch': app.end, 'line': lineNumber}}
                            };
                            if (app.label) {
                                uglyObject.label = app.label;
                            }
                            uglyObject.sourceChannelName = sourceChannelName;
                            uglyObject.sinkChannelName = sinkChannelName;
                            success.push(uglyObject);

                            const nameToCheck = uglyObject.label ? uglyObject.label : uglyObject.name;
                            // Check that each app has a unique label (either explicit or implicit)
                            const previous = alreadySeen[nameToCheck];
                            if (typeof previous === 'number') {
                                this.recordError(streamdef, {
                                    'message': app.label ?
                                        'Label \'' + app.label + '\' should be unique but app \'' + app.name +
                                        '\' (at app position ' + m + ') and app \'' + streamdef.apps[previous].name +
                                        '\' (at app position ' + previous + ') both use it'
                                        : 'App \'' + app.name +
                                        '\' should be unique within the stream, use a label to differentiate multiple occurrences',
                                    'range': uglyObject.range
                                });
                            } else {
                                alreadySeen[nameToCheck] = m;
                            }
                        }
                    } else {
                        // error case: ':stream:foo >'
                        // there is no target for the tap yet
                        if (streamdef.sourceChannel) {
                            // need to build a dummy app to hang the sourcechannel off
                            const obj = {
                                sourceChannelName: streamdef.sourceChannel.channel.name
                            };
                            success.push(obj);
                        }
                    }
                    if (streamdef.errors) {
                        errorsToProcess = streamdef.errors;
                    }
                }
                line.nodes = success;

                if (errorsToProcess && errorsToProcess.length !== 0) {
                    line.errors = [];
                    for (let e = 0; e < errorsToProcess.length; e++) {
                        const error = errorsToProcess[e];
                        errorToRecord = {};
                        errorToRecord.accurate = true;
                        errorToRecord.message = error.message;
                        if (error.range) {
                            errorToRecord.range = error.range;
                        } else {
                            console.error('ERROR: WHAT ARE WE DEALING WITH HERE?');
                            // start = error.start;
                            // end = typeof error.end === 'number' ? error.end : start+1;
                            // errorToRecord.range = {'start':{'ch':start,'line':lineNumber},'end':{'ch':end,'line':lineNumber}};
                        }
                        line.errors.push(errorToRecord);
                    }
                }
                    // $log.info('JSParse: translated to '+JSON.stringify(line));
                    this.lines.push(line);
                } catch (err) {
                    console.log('ERROR PROCESSING: ' + JSON.stringify(err));
                    if (typeof err === 'object' && err.msg) {
                        if (!line.errors) {
                            line.errors = [];
                        }
                        errorToRecord = {};
                        errorToRecord.accurate = true;
                        errorToRecord.message = err.msg;
                        if (err.range) {
                            errorToRecord.range = err.range;
                        } else {
                            start = err.start;
                            end = typeof err.end === 'number' ? err.end : start + 1;
                            errorToRecord.range = {'start': {'ch': start, 'line': lineNumber}, 'end': {'ch': end, 'line': lineNumber}};
                        }
                        line.errors.push(errorToRecord);
                        this.lines.push(line);

                        let str = '';
                        for (let i = 0; i < err.start; i++) {
                            str += ' ';
                        }
                        str += '^';
                        console.error(str);
                        console.error(err.msg);
                    } else {
                        console.error(err);
                    }
                }
            }
            return {'lines': this.lines};
        }
}


export namespace Parser {
    export interface Pos {
        ch: number;
        line: number;
    }
    export interface Range {
        start: Pos;
        end: Pos;
    }
    export interface Error {
        message: String;
        range: Range;
    }
    export interface DestinationReference {
        type: string;
        name: string;
        start: number;
        end: number;
    }
    export interface TaskNode {
        app?: AppNode;
        name?: string;
        namerange?: Range;
        errors?: Error[];
    }
    export interface AppNode {
        label?: string;
        name: string;
        options?;
        start: number;
        end: number;
    }
    export interface StreamDef {
        name?: string;
        apps?: AppNode[];
        sourceChannel?: ChannelReference;
        sinkChannel?: ChannelReference;
        errors?: Error[];
    }
    export interface ChannelReference {
        channel: DestinationReference;
        start?: number;
        end?: number;
    }
    export interface ParsedTask {
        group: string;
        grouprange: Range;
        type: string;
        name: string;
        range: Range;
        options;
        optionsranges: Range[];
    }

    export interface ParseResult {
        lines: Line[];
    }

    export interface Node {
        group: string;
        label?: string;
        type: string;
        name: string;
        range: Parser.Range;
        options?;
        optionsranges?: Parser.Range[];
        sourceChannelName?: string;
        sinkChannelName?: string;
    }

    export interface Line {
        nodes?: Node[];
        errors?: Error[];
    }

    // mode is stream or task
    export function parse(definitionsText: string, mode: string): ParseResult {
        return new InternalParser(definitionsText, mode).parse();
    }
}
