/*
 * Copyright 2016-2018 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://www.apache.org/licenses/LICENSE-2.0
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
import { LoggerService } from './logger.service';

/**
 * Parse a textual stream definition.
 *
 * @author Andy Clement
 * @author Alex Boyko
 */
class InternalParser {

    static DEBUG = false;

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

    private tokenListToStringList(tokens) {
        if (tokens.length === 0) {
            return '';
        }
        let result = '';
        for (let t = 0; t < tokens.length; t++) {
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

    private noMorePipes(): boolean {
        let tp = this.tokenStreamPointer;
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

    private peekDestinationComponentToken(mustMatchAndConsumeIfDoes: boolean): Token {
        const t = this.peekAtToken();
        if (t === null) {
            throw {'msg': 'Out of data', 'start': this.text.length};
        }
        if (!(this.isKind(t, TokenKind.IDENTIFIER) || this.isKind(t, TokenKind.STAR) ||
              this.isKind(t, TokenKind.SLASH) || this.isKind(t, TokenKind.HASH))) {
           if (mustMatchAndConsumeIfDoes) {
               throw {'msg': 'Tokens of kind ' + t.kind + ' cannot be used in a destination', 'start': t.start};
           } else {
               return null;
           }
        }
        if (mustMatchAndConsumeIfDoes) {
            this.nextToken();
        }
        return t;
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

    // A destination reference is of the form ':'(IDENTIFIER|STAR|SLASH|HASH)['.'(IDENTIFIER|STAR|SLASH|HASH]*
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
        let isDotted = false;
        nameComponents.push(this.peekDestinationComponentToken(true));
        while (this.isNextTokenAdjacent() && (this.peekDestinationComponentToken(false) !== null)) {
            nameComponents.push(this.peekDestinationComponentToken(true));
        }
        while (this.isNextTokenAdjacent() && this.peekToken(TokenKind.DOT)) {
            currentToken = this.eatToken(TokenKind.DOT);
            isDotted = true;
            if (!this.isNextTokenAdjacent()) {
                t = this.peekAtToken();
                if (t) {
                    throw {'msg': 'No whitespace allowed in destination', 'start': currentToken.end, 'end': t.start};
                } else {
                    throw {'msg': 'Out of data - incomplete destination', 'start': currentToken.start};
                }
            }
            nameComponents.push(currentToken);
            nameComponents.push(this.peekDestinationComponentToken(true));
            while (this.isNextTokenAdjacent() && (this.peekDestinationComponentToken(false) !== null)) {
                nameComponents.push(this.peekDestinationComponentToken(true));
            }
        }
        let type = null;
        // TODO this does not cope with dotted stream names...
        if (!isDotted || !tapAllowed) {
            type = 'destination';
        } else {
            type = 'tap';
        }
        const endpos = nameComponents[nameComponents.length - 1].end;
        const destinationObject: Parser.DestinationReference = {
            type: type,
            start: firstToken.start,
            end: endpos,
            name: (type === 'tap' ? 'tap:' : '') + this.tokenListToStringList(nameComponents)
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
    private eatArgValue(): string {
        const t = this.nextToken();
        if (this.isKind(t, TokenKind.IDENTIFIER) || this.isKind(t, TokenKind.LITERAL_STRING)) {
            return t.data;
        } else {
            throw {'msg': 'expected argument value', 'start': t.start};
        }
    }

    /**
     * Consumes and returns (identifier [DOT identifier]*) as long as they're adjacent.
     *
     * @param error the kind of error to report if input is ill-formed
     */
    private eatDottedName(errorMessage?: string): Token[] {
        if (!errorMessage) {
            errorMessage = 'expected identifier';
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
    private maybeEatAppArgs(): Parser.Option[] {
        let args: Parser.Option[] = null;
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
        const args: Parser.Option[] = this.maybeEatAppArgs();
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
    private eatAppList(preceedingSourceChannelSpecified: boolean): Parser.AppNode[] {
        const appNodes: Parser.AppNode[] = [];
        let usedListDelimiter = -1;
        let usedStreamDelimiter = -1;
        appNodes.push(this.eatApp());
        while (this.moreTokens()) {
            const t = this.peekAtToken();
            if (this.isKind(t, TokenKind.PIPE)) {
                if (usedListDelimiter >= 0) {
                    throw {'msg': 'Don\'t mix | and || in the same stream definition', 'start': usedListDelimiter};
                }
                usedStreamDelimiter = t.start;
                this.nextToken();
                appNodes.push(this.eatApp());
            } else if (this.isKind(t, TokenKind.DOUBLE_PIPE)) {
                if (preceedingSourceChannelSpecified) {
                    throw {'msg': 'Don\'t use || with channels', 'start': t.start};
                }
                if (usedStreamDelimiter >= 0) {
                    throw {'msg': 'Don\'t mix | and || in the same stream definition', 'start': usedStreamDelimiter};
                }
                usedListDelimiter = t.start;
                this.nextToken();
                appNodes.push(this.eatApp());
            } else {
                // might be followed by sink channel
                break;
            }
        }
        const isFollowedBySinkChannel = this.peekToken(TokenKind.GT);
        if (isFollowedBySinkChannel && usedListDelimiter >= 0) {
            throw {'msg': 'Don\'t use || with channels', 'start': usedListDelimiter};
        }
        for (let appNumber = 0; appNumber < appNodes.length; appNumber++) {
            appNodes[appNumber].nonStreamApp = !preceedingSourceChannelSpecified && !isFollowedBySinkChannel && (usedStreamDelimiter < 0);
        }
        return appNodes;
    }

    private toString(token): string {
        if (token.data) {
            return token.data;
        }
        return token.kind;
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

        // the construct :foo > :bar is a source then a sink with no app. Special handling for
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

        let appNodes: Parser.AppNode[] = null;
        if (bridge) {
            // Create a bridge app to hang the source/sink channels off
            this.tokenStreamPointer--; // Rewind so we can nicely eat the sink channel
            appNodes = [{'name': 'bridge', 'start': this.peekAtToken().start, 'end': this.peekAtToken().end, 'nonStreamApp': false}];
        } else {
            appNodes = this.eatAppList(sourceChannelNode != null);
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

    public parse(): Parser.ParseResult {
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
                if (InternalParser.DEBUG) {
                  LoggerService.log('JSParse: processing ' + this.text);
                }
                this.tokenStream = tokenize(this.text);
                if (InternalParser.DEBUG) {
                  LoggerService.log('JSParse: tokenized to ' + JSON.stringify(this.tokenStream));
                }
                this.tokenStreamPointer = 0;
                this.tokenStreamLength = this.tokenStream.length;

                let errorsToProcess: Parser.Error[] = [];
                const success = [];
                let app: Parser.AppNode;
                let option;
                let options: Map<string, string>;
                let optionsranges: Map<string, Parser.Range>;
                if (this.mode === 'task') {
                    const taskdef = this.eatTaskDefinition(lineNumber);
                    app = taskdef.app;
                    if (app) {
                        options = new Map();
                        optionsranges = new Map();
                        if (app.options) {
                            for (let o1 = 0; o1 < app.options.length; o1++) {
                                option = app.options[o1];
                                options.set(option.name, option.value);
                                optionsranges.set(option.name, {
                                     'start': {'ch': option.start, 'line': lineNumber},
                                     'end': {'ch': option.end, 'line': lineNumber}});
                            }
                        }
                        const taskObject: Parser.TaskApp = {
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
                    if (InternalParser.DEBUG) {
                      LoggerService.log('JSParse: parsed to stream definition: ' + JSON.stringify(streamdef));
                    }
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
                                } else if (m === (streamdef.apps.length - 1) && !streamdef.sinkChannel) {
                                    // if last expect it to be sink only
                                    // without sink channel. i.e. source | processor > :dest
                                    // we fall back to processor type
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
                            if (app.nonStreamApp) {
                                expectedType = 'app';
                            }
                            options = new Map();
                            optionsranges = new Map();
                            if (app.options) {
                                for (let o2 = 0; o2 < app.options.length; o2++) {
                                    option = app.options[o2];
                                    options.set(option.name, option.value);
                                    optionsranges.set(option.name, {'start': {'ch': option.start, 'line': lineNumber},
                                      'end': {'ch': option.end, 'line': lineNumber}});
                                }
                            }
                            const streamObject: Parser.StreamApp = {
                                group: streamName,
                                type: expectedType,
                                name: app.name,
                                options: options,
                                optionsranges: optionsranges,
                                range: {'start': {'ch': app.start, 'line': lineNumber}, 'end': {'ch': app.end, 'line': lineNumber}}
                            };
                            if (app.label) {
                                streamObject.label = app.label;
                            }
                            streamObject.sourceChannelName = sourceChannelName;
                            streamObject.sinkChannelName = sinkChannelName;
                            success.push(streamObject);

                            const nameToCheck = streamObject.label ? streamObject.label : streamObject.name;
                            // Check that each app has a unique label (either explicit or implicit)
                            const previous = alreadySeen[nameToCheck];
                            if (typeof previous === 'number') {
                                this.recordError(streamdef, {
                                    'message': app.label ?
                                        'Label \'' + app.label + '\' should be unique but app \'' + app.name +
                                        '\' (at app position ' + m + ') and app \'' + streamdef.apps[previous].name +
                                        '\' (at app position ' + previous + ') both use it'
                                        : 'App \'' + app.name +
                                        '\' should be unique within the definition, use a label to differentiate multiple occurrences',
                                    'range': streamObject.range
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
                        errorToRecord.range = error.range;
                        line.errors.push(errorToRecord);
                    }
                }
                this.lines.push(line);
            } catch (err) {
                if (InternalParser.DEBUG) {
                  LoggerService.log('ERROR PROCESSING: ' + JSON.stringify(err));
                }
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
                    LoggerService.error(str);
                    LoggerService.error(err.msg);
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
        message: string;
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
        options?: Parser.Option[];
        start: number;
        end: number;
        nonStreamApp?: boolean;
    }

    export interface Option {
        name: string;
        value: string;
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

    export interface Node {
        group: string;
        type: string;
        name: string;
        range: Parser.Range;
        options?: Map<string, string>;
        optionsranges?: Map<string, Parser.Range>;
    }

    export interface StreamApp extends Node {
        label?: string;
        sourceChannelName?: string;
        sinkChannelName?: string;
    }

    export interface TaskApp extends Node {
        grouprange: Range;
    }

    export interface ParseResult {
        lines: Line[];
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
