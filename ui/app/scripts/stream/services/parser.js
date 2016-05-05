/*
 * Copyright 2016 the original author or authors.
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

define(function() {
	'use strict';
	
	return ['$log', function($log) {

        var tokenKinds = {
        		IDENTIFIER: {'id':0},
        		DOUBLE_MINUS: {'id': 1,'value':'--'},
        		EQUALS: {'id':2,'value':'='},
        		AND: {'id':3,'value':'&'},
        		PIPE: {'id':4,'value':'|'},
        		NEWLINE: {'id':5},
        		COLON: {'id':6,'value':':'},
        		GT: {'id':7,'value':'>'},
        		SEMICOLON: {'id':8,'value':';'},
        		REFERENCE: {'id':9,'value':'@'},
        		DOT: {'id':10,'value':'.'},
        		LITERAL_STRING: {'id':11},
        		EOF: {'id':12,'value':''}
        };        

        // TODO switch to the var x = (function() {... return yyy; })(); structure
        function tokenize(text) {
        	var tokens = [];
        	var toProcess = text+'\0';
        	var justProcessedEquals = false;
        	var haveSeenOptionQualifier = false;
        	var max = text.length;
        	var pos = 0;

			function isQuote(ch) {
				return ch === '\'' || ch === '"';
			}

			function isWhitespace(ch) {
				return ch === ' ' || ch === '\t' || ch === '\r' || ch === '\n';
			}

			function isDigit(ch) {
				if (ch > 255) {
					return false;
				}
				return ch>='0' && ch<='9';
			}

			function isAlphabetic(ch) {
				if (ch > 255) {
					return false;
				}
				return (ch>='a' && ch<='z') || (ch>='A' && ch<='Z');
			}

			function subarray(start, end) {
				return text.substring(start,end);
			}

			function sameQuotes(pos1,pos2) {
				if (toProcess[pos1] === '\'') {
					return toProcess[pos2] === '\'';
				}
				else if (toProcess[pos1] === '"') {
					return toProcess[pos2] === '"';
				}
				return false;
			}

			function isArgValueIdentifierTerminator(ch,quoteOpen) {
				return (ch === '|' && !quoteOpen) || (ch === ';' && !quoteOpen) || ch === '\0' || (ch === ' ' && !quoteOpen) ||
					(ch === '\t' && !quoteOpen) || (ch === '>' && !quoteOpen) ||
					ch === '\r' || ch === '\n';
			}

			// ID: ('a'..'z'|'A'..'Z'|'_'|'$') ('a'..'z'|'A'..'Z'|'_'|'$'|'0'..'9'|DOT_ESCAPED|'-')*;
			function isIdentifier(ch) {
				return isAlphabetic(ch) || isDigit(ch) || ch === '_' || ch === '$' || ch === '-';
			}

			/**
        	 * Lex a string literal which uses single quotes as delimiters. To include a single quote within the literal, use a
        	 * pair ''
        	 */
        	function lexQuotedStringLiteral() {
        		var start = pos;
        		var terminated = false;
        		while (!terminated) {
        			pos++;
        			var ch = toProcess[pos];
        			if (ch === '\'') {
        				// may not be the end if the char after is also a '
        				if (toProcess[pos + 1] === '\'') {
        					pos++; // skip over that too, and continue
        				}
        				else {
        					terminated = true;
        				}
        			}
        			if (pos >= max) {
        				throw {'msg':'StreamDefinitionException: non terminating quoted string','start':start,'end':pos};
        			}
        		}
        		pos++;
        		tokens.push({'kind':tokenKinds.LITERAL_STRING,'data':subarray(start, pos), 'start': start, 'end':pos});
        	}
        	
        	function pushCharToken(tokenkind) {
        		tokens.push({'kind':tokenkind,'start':pos,'end':pos+1});
        		pos++;
        	}

        	function pushPairToken(tokenkind) {
        		tokens.push({'kind':tokenkind,'start':pos,'end':pos+2});
        		pos+=2;
        	}
        	
        	/**
        	 * To prevent the need to quote all argument values, this identifier lexing function is used just after an '=' when
        	 * we are about to digest an arg value. It is much more relaxed about what it will include in the identifier.
        	 */
        	function lexArgValueIdentifier() {
        		// Much of the complexity in here relates to supporting cases like these:
        		// 'hi'+payload
        		// 'hi'+'world'
        		// In these situations it looks like a quoted string and that perhaps the entire
        		// argument value is being quoted, but in fact half way through it is discovered that the
        		// entire value is not quoted, only the first part of the argument value is a string literal.

        		var start = pos;
        		var quoteOpen = false;
        		var quoteClosedCount = 0; // Enables identification of this pattern: 'hello'+'world'
        		var quoteInUse = null; // If set, indicates this is being treated as a quoted string
        		if (isQuote(toProcess[pos])) {
        			quoteOpen = true;
        			quoteInUse = toProcess[pos++];
        		}
        		do {
        			var ch = toProcess[pos];
        			if ((quoteInUse !== null && ch === quoteInUse) || (quoteInUse === null && isQuote(ch))) {
        				if (quoteInUse !== null && quoteInUse === '\'' && ch === '\'' && toProcess[pos + 1] === '\'') {
        					pos++; // skip over that too, and continue
        				}
        				else {
        					quoteOpen = !quoteOpen;
        					if (!quoteOpen) {
        						quoteClosedCount++;
        					}
        				}
        			}
        			pos++;
        		}
        		while (pos<toProcess.length && !isArgValueIdentifierTerminator(toProcess[pos], quoteOpen));
        		var data = null;
        		if (quoteClosedCount < 2 && sameQuotes(start, pos - 1)) {
        			tokens.push({'kind':tokenKinds.LITERAL_STRING,
        					'data':subarray(start, pos), 'start':start,'end': pos});
        		}
        		else {
        			data = subarray(start, pos);
        			tokens.push({'kind':tokenKinds.IDENTIFIER, 'data':data, 'start':start, 'end':pos});
        		}
        	}
        	
        	/**
        	 * Lex a string literal which uses double quotes as delimiters. To include a single quote within the literal, use a
        	 * pair ""
        	 */
        	function lexDoubleQuotedStringLiteral() {
        		var start = pos;
        		var terminated = false;
        		while (!terminated) {
        			pos++;
        			var ch = toProcess[pos];
        			if (ch === '"') {
        				// may not be the end if the char after is also a "
        				if (toProcess[pos + 1] === '"') {
        					pos++; // skip over that too, and continue
        				}
        				else {
        					terminated = true;
        				}
        			}
        			if (pos >= max) {
        				throw {'msg':'StreamDefinitionException: non terminating double quoted string','start':start,'end':pos};
        			}
        		}
        		pos++;
        		tokens.push({'kind':tokenKinds.LITERAL_STRING,'data':subarray(start, pos), 'start':start, 'end':pos});
        	}

        	/**
        	 * For the variant tokenizer (used following an '=' to parse an argument value) we only terminate that identifier if
        	 * encountering a small set of characters. If the argument has included a ' to put something in quotes, we remember
        	 * that and don't allow ' ' (space) and '\t' (tab) to terminate the value.
        	 */
        	function lexIdentifier() {
        		var start = pos;
        		do {
        			pos++;
        		}
        		while (isIdentifier(toProcess[pos]));
        		var data = subarray(start, pos);
        		tokens.push({'kind':tokenKinds.IDENTIFIER, 'data':data, 'start':start, 'end':pos});
        	}
        	
        	/**
        	 * Check if this might be a two character token.
        	 */
        	function isTwoCharToken(tokenkind) {
        		// assert tokenkind.value && tokenkind.value.length==2
        		// assert toProcess.charAt(pos) == tokenkind.value.charAt(0);
        		return toProcess.charAt(pos+1) === tokenkind.value.charAt(1);
        	}
        	
        	while (pos < max) {
        		var ch = toProcess.charAt(pos);
        		if (justProcessedEquals) { // if in this pattern --foo=bar
        			if (!isWhitespace(ch) && ch!==0 && haveSeenOptionQualifier) {
        				// following an '=' we commence a variant of regular tokenization
        				// consuming everything up to the next special char.
        				// This allows SpEL expressions to be used without quoting in many
        				// situations
        				lexArgValueIdentifier();
        			}
        			justProcessedEquals = false;
        			continue;
        		}
        		if (isAlphabetic(ch) || isDigit(ch) || ch === '_') {
        			lexIdentifier();
        		} else {
        			switch (ch) {
        			case '-':
        				if (!isTwoCharToken(tokenKinds.DOUBLE_MINUS)) {
        					throw {'msg':'expected two hyphens: \'--\'','start':pos};
        				}
        				pushPairToken(tokenKinds.DOUBLE_MINUS);
        				haveSeenOptionQualifier = true;
        				break;
        			case '=':
        				justProcessedEquals=true;
        				pushCharToken(tokenKinds.EQUALS);
        				break;
        			case '&':
        				pushCharToken(tokenKinds.AND);
        				break;
        			case '|':
        				pushCharToken(tokenKinds.PIPE);
        				break;
        			case ' ':
        			case '\t':
        			case '\r':
        				pos++;
        				break;
        			case '\n':
        				pushCharToken(tokenKinds.NEWLINE);
        				break;
					case '.':
						pushCharToken(tokenKinds.DOT);
						break;
					case '>':
						pushCharToken(tokenKinds.GT);
						break;
					case ':':
						pushCharToken(tokenKinds.COLON);
						break;
					case ';':
						pushCharToken(tokenKinds.SEMICOLON);
						break;
					case '\'':
						lexQuotedStringLiteral();
						break;
					case '"':
						lexDoubleQuotedStringLiteral();
						break;
					case '@':
						pushCharToken(tokenKinds.REFERENCE);
						break;
					case 0:
						// hit sentinel at end of char data
						pos++; // will take us to the end
						break;
					case '\\':
						throw {'msg':'StreamDefinitionException: Unexpected escape char','start':pos};
					default:
						throw {'msg':'StreamDefinitionException: Unexpected character','start':pos};
        			}
        		}
        	}
        	return tokens;
        }

        // TODO switch to the var x= (function() {... return yyy; })(); model
        function parse(definitionsText) {
			var lines = [];
			var line;
			var text;
			var tokenStream;
			var tokenStreamPointer;
			var tokenStreamLength;
			var textlines = definitionsText.split('\n');

			function tokenListToStringList(tokens,delimiter) {
        		if (tokens.length===0) {
        			return '';
        		}
        		var result = '';
        		for (var t=0;t<tokens.length;t++) {
        			if (t>0) {
        				result = result + delimiter;
        			}
        			result=result+tokens[t].data;
        		}
        		return result;
        	}

        	function isLegalChannelPrefix(string) { // jshint ignore:line
        		return string === 'queue' || string === 'topic' || string ==='tap';
        	}

        	function equalsIgnoreCase(stringA,stringB) { // jshint ignore:line
        		return stringA.toUpperCase()===stringB.toUpperCase();
        	}

			function isKind(token, expected) {
				return token.kind.id === expected.id;
			}

			function isNextTokenAdjacent() {
				if (tokenStreamPointer >= tokenStreamLength) {
					return false;
				}
				var last = tokenStream[tokenStreamPointer - 1];
				var next = tokenStream[tokenStreamPointer];
				return next.start === last.end;
			}

			function moreTokens() {
				return tokenStreamPointer < tokenStreamLength;
			}

			function nextToken() {
				if (tokenStreamPointer >= tokenStreamLength) {
					throw {'msg':'Out of data','start':text.length};
				}
				return tokenStream[tokenStreamPointer++];
			}

			function peekAtToken() {
				if (tokenStreamPointer >= tokenStreamLength) {
					return null;
				}
				return tokenStream[tokenStreamPointer];
			}

			function lookAhead(distance,desiredTokenKind) {
				if ((tokenStreamPointer + distance) >= tokenStreamLength) {
					return false;
				}
				var t = tokenStream[tokenStreamPointer + distance];
				if (t.kind.id === desiredTokenKind.id) {
					return true;
				}
				return false;
			}

			function noMorePipes(tp) {
				if (!tp) {
					tp = tokenStreamPointer;
				}
				while (tp < tokenStreamLength) {
					if (tokenStream[tp++].kind.id === tokenKinds.PIPE.id) {
						return false;
					}
				}
				return true;
			}

			function peekToken(desiredTokenKind, consumeIfMatched) {
				if (!consumeIfMatched) {
					consumeIfMatched = false;
				}
				if (!moreTokens()) {
					return false;
				}
				var t = peekAtToken();
				if (t.kind.id === desiredTokenKind.id) {
					if (consumeIfMatched) {
						tokenStreamPointer++;
					}
					return true;
				}
				else {
					return false;
				}
			}

			function eatToken(expectedKind) {
				if (!expectedKind) {
					throw {'msg':'Must pass expected token kind to eatToken()'};
				}
				var t = nextToken();
				if (t === null) {
					throw {'msg':'Out of data','start':text.length};
				}
				if (!isKind(t,expectedKind)) {
					// TODO better text for the ids
					throw {'msg':'Token not of expected kind (Expected '+expectedKind.id+' found '+t.kind.id+')','start':t.start};
				}
				return t;
			}

			// A destination reference is of the form ':'IDENTIFIER['.'IDENTIFIER]*
        	function eatDestinationReference(tapAllowed) {
        		var nameComponents = [];
        		var t;
                var currentToken;
        		var firstToken = nextToken();
        		if (firstToken.kind !== tokenKinds.COLON) {
        			throw {'msg':'destination must start with a \':\'','start':firstToken.start,'end':firstToken.end};
        		}
        		if (!isNextTokenAdjacent()) {
    				t = peekAtToken();
    				if (t) {
    					throw {'msg':'no whitespace allowed in destination','start':firstToken.end,'end':t.start};
    				} else {
    					throw {'msg':'out of data - incomplete destination','start':firstToken.start};
    				}
    			}
        		nameComponents.push(eatToken(tokenKinds.IDENTIFIER)); // the non-optional identifier
        		while (isNextTokenAdjacent() && peekToken(tokenKinds.DOT)) {
        			currentToken = eatToken(tokenKinds.DOT);
        			if (!isNextTokenAdjacent()) {
        				t = peekAtToken();
        				if (t) {
        					throw {'msg':'no whitespace allowed in destination','start':currentToken.end,'end':t.start};
        				} else {
        					throw {'msg':'out of data - incomplete destination','start':currentToken.start};
        				}
        			}
        			nameComponents.push(eatToken(tokenKinds.IDENTIFIER));
        		}
        		var type = null;
        		// TODO this does not cope with dotted stream names...
        		if (nameComponents.length<2 || !tapAllowed) {
        			type = 'destination';
        		} else {
        			type = 'tap';
        		}
        		var endpos = nameComponents[nameComponents.length - 1].end;
        		var destinationObject = {};
        		destinationObject.type = type;
        		destinationObject.start = firstToken.start;
        		destinationObject.end = endpos;
        		destinationObject.name = (type==='tap'?'tap:':'')+ tokenListToStringList(nameComponents,'.');
        		return destinationObject;
        	}

        	// return true if the specified tokenpointer appears to be pointing at a channel
        	function looksLikeChannel(tp) {
        		if (!tp) {
        			tp = tokenStreamPointer;
        		}
        		if (moreTokens() && isKind(tokenStream[tp],tokenKinds.COLON)) {
        			return true;
        		}
        		return false;
        	}

        	// identifier ':' identifier >
        	// tap ':' identifier ':' identifier '.' identifier >
        	function maybeEatSourceChannel() {
        		var gtBeforePipe = false;
        		// Seek for a GT(>) before a PIPE(|)
        		for (var tp = tokenStreamPointer; tp < tokenStreamLength; tp++) {
        			var t = tokenStream[tp];
        			if (t.kind === tokenKinds.GT) {
        				gtBeforePipe = true;
        				break;
        			}
        			else if (t.kind === tokenKinds.PIPE) {
        				break;
        			}
        		}
        		if (!gtBeforePipe || !looksLikeChannel(tokenStreamPointer)) {
        			return null;
        		}

        		var channel = eatDestinationReference(true);
        		var gt = eatToken(tokenKinds.GT);
        		return {'channel':channel,'end':gt.end};
        	}

        	// '>' ':' identifier
        	function maybeEatSinkChannel() {
        		var sinkChannelNode = null;
        		if (peekToken(tokenKinds.GT)) {
        			var gt = eatToken(tokenKinds.GT);
        			var channelNode = eatDestinationReference(false);
        			sinkChannelNode = {'channel':channelNode,'start':gt.start};
        		}
        		return sinkChannelNode;
        	}


        	/**
        	 * Return the concatenation of the data of many tokens.
        	 */
        	function data(many) {
        		var result = '';
        		for (var i=0;i<many.length;i++) {
        			var t = many[i];
        			if (t.data) {
        				result=result+t.data;
        			}
        			else {
        				result=result+t.kind.value;
        			}
        		}
        		return result;
        	}

        	// argValue: identifier | literal_string
        	function eatArgValue() {
        		var t = nextToken();
        		var argValue = null;
        		if (isKind(t,tokenKinds.IDENTIFIER)) {
        			argValue = t.data;
        		}
        		else if (isKind(t,tokenKinds.LITERAL_STRING)) {
        			argValue = t.data;
//        			var quotesUsed = t.data.substring(0, 1);
//        			argValue = t.data.substring(1, t.data.length - 1).replace(quotesUsed + quotesUsed, quotesUsed);
        		}
        		else {
        			throw {'msg':'expected argument value','start':t.start};
        		}
        		return argValue;
        	}

        	/**
        	 * Consumes and returns (identifier [DOT identifier]*) as long as they're adjacent.
        	 *
        	 * @param error the kind of error to report if input is ill-formed
        	 */
        	function eatDottedName(errorMessage) {
        		if (!errorMessage) {
        			errorMessage = 'not expected token';
        		}
        		var result = [];
        		var name = nextToken();
        		if (!isKind(name,tokenKinds.IDENTIFIER)) {
        			throw {'msg':errorMessage,'start':name.start};
        		}
        		result.push(name);
        		while (peekToken(tokenKinds.DOT)) {
        			if (!isNextTokenAdjacent()) {
        				throw {'msg':'no whitespace in dotted name','start':name.start};
        			}
        			result.push(nextToken()); // consume dot
        			if (peekToken(tokenKinds.IDENTIFIER) && !isNextTokenAdjacent()) {
        				throw {'msg':'no whitespace in dotted name','start':name.start};
        			}
        			result.push(eatToken(tokenKinds.IDENTIFIER));
        		}
        		return result;
        	}

        	// moduleArguments : DOUBLE_MINUS identifier(name) EQUALS identifier(value)
        	function maybeEatModuleArgs() {
        		var args = null;
        		// TODO not entirely sure this first problem can happen since dashes can now be in the module names
        		if (peekToken(tokenKinds.DOUBLE_MINUS) && isNextTokenAdjacent()) {
        			throw {'msg':'Expected whitespace after module name before option','start':peekAtToken().start};
        		}
        		while (peekToken(tokenKinds.DOUBLE_MINUS)) {
        			var dashDash = nextToken(); // skip the '--'
        			if (peekToken(tokenKinds.IDENTIFIER) && !isNextTokenAdjacent()) {
            			throw {'msg':'No whitespace allowed after -- but before option name','start':dashDash.end,'end':peekAtToken().start};
        			}
        			var argNameComponents = eatDottedName();
        			if (peekToken(tokenKinds.EQUALS) && !isNextTokenAdjacent()) {
        				throw {'msg':'No whitespace allowed before equals','start':argNameComponents[argNameComponents.length-1].end,'end':peekAtToken().start};
        			}
        			var equalsToken = eatToken(tokenKinds.EQUALS);
        			if (peekToken(tokenKinds.IDENTIFIER) && !isNextTokenAdjacent()) {
        				throw {'msg':'No whitespace allowed before option value','start':equalsToken.end,'end':peekAtToken().start};
        			}
        			// Process argument value:
        			var t = peekAtToken();
        			var argValue = eatArgValue();
        			if (args === null) {
        				args = [];
        			}
        			args.push({'name':data(argNameComponents), 'value':argValue, 'start':dashDash.start, 'end':t.end});
        		}
        		return args;
        	}

        	// module: [label':']? identifier (moduleArguments)*
        	function eatModule() {
        		var label = null;
        		var name = nextToken();
        		if (!isKind(name,tokenKinds.IDENTIFIER)) {
        			throw {'msg':'Expected module name ','start':name.start,'end':name.end};
        		}
        		if (peekToken(tokenKinds.COLON)) {
        			if (!isNextTokenAdjacent()) {
        				throw {'msg': 'no whitespace between label name and colon','start':name.end,'end':peekAtToken().start};
        			}
        			nextToken(); // swallow colon
        			label = name;
        			name = eatToken(tokenKinds.IDENTIFIER);
        		}
        		var moduleNameToken = name;
        		var args = maybeEatModuleArgs();
        		var startpos = label !== null ? label.start : moduleNameToken.start;
        		var moduleNode = {'name':moduleNameToken.data,'start':startpos,'end':moduleNameToken.end};
        		if (label) {
        			moduleNode.label = label.data;
        		}
        		if (args) {
        			moduleNode.options = args;
        		}

        		return moduleNode;
        	}

        	// moduleList: module (| module)*
        	// A stream may end in a module (if it is a sink) or be followed by
        	// a sink channel.
        	function eatModuleList() {
        		var moduleNodes = [];
        		moduleNodes.push(eatModule());
        		while (moreTokens()) {
        			var t = peekAtToken();
        			if (isKind(t,tokenKinds.PIPE)) {
        				nextToken();
        				moduleNodes.push(eatModule());
        			}
        			else {
        				// might be followed by sink channel
        				break;
        			}
        		}
        		return moduleNodes;
        	}

        	// (name =)
        	function maybeEatStreamName() {
        		var streamName = null;
        		if (lookAhead(1, tokenKinds.EQUALS)) {
        			if (peekToken(tokenKinds.IDENTIFIER)) {
        				streamName = eatToken(tokenKinds.IDENTIFIER).data;
        				nextToken(); // skip '='
        			}
        			else {
        				throw {'msg':'Illegal Stream Name '+peekAtToken(),'start':peekAtToken().start};
        			}
        		}
        		return streamName;
        	}

        	function toString(token) {
        		if (token.data) {
        			return token.data;
        		}
        		if (token.kind.value) {
        			return token.kind.value;
        		}
    			return JSON.stringify(token);
        	}

        	function outOfData() {
        		return peekAtToken() === null;
        	}

        	function recordError(node, error) {
        		if (!node.errors) {
	        		node.errors=[];
	        	}
        		node.errors.push(error);
        	}

        	function eatStream() {
        		var streamNode = {};

        		var streamName = maybeEatStreamName();
        		if (streamName) {
        			streamNode.name = streamName;
        		}

        		var sourceChannelNode = maybeEatSourceChannel();

        		// the construct queue:foo > topic:bar is a source then a sink with no module. Special handling for
        		// that is right here
        		var bridge = false;
        		if (sourceChannelNode) { // so if we are just after a '>'
        			streamNode.sourceChannel = sourceChannelNode;
        			if (looksLikeChannel() && noMorePipes()) {
        				bridge=true;
        			}
        		}

        		// Are we out of data? If so return what we have but include errors.
        		if (outOfData()) {
        			recordError(streamNode,{'msg':'unexpectedly out of data','start':text.length});
        			return streamNode;
        		}

        		var moduleNodes = null;
        		if (bridge) {
        			// Create a bridge module to hang the source/sink channels off
        			tokenStreamPointer--; // Rewind so we can nicely eat the sink channel
        			moduleNodes = [];
        			moduleNodes.push({'name':'bridge','start':peekAtToken().startpos, 'end':peekAtToken().endpos});
        		}
        		else {
        			moduleNodes = eatModuleList();
        		}
        		streamNode.modules = moduleNodes;
        		var sinkChannelNode = maybeEatSinkChannel();

        		// Further data is an error
        		if (moreTokens()) {
        			var t = peekAtToken();
        			throw {'msg':'Unexpected data after stream definition: '+toString(t),'start':t.start};
        		}
        		if (sinkChannelNode) {
        			streamNode.sinkChannel = sinkChannelNode;
        		}
        		return streamNode;
        	}

			var start, end, errorToRecord;
        	for (var lineNumber=0;lineNumber<textlines.length;lineNumber++) {
	        	try {
		        	line = {};
		        	line.errors = null;

		        	text = textlines[lineNumber];
		        	if (text.trim().length === 0) {
		        		lines.push({'success':[],'errors':[]});
		        		continue;
		        	}
	        		$log.info('JSParse: processing '+text);
		        	tokenStream = tokenize(text);
		        	$log.info('JSParse: tokenized to '+JSON.stringify(tokenStream));
		        	tokenStreamPointer = 0;
		        	tokenStreamLength = tokenStream.length;
		        	// time | log
		        	// [{"token":0,"data":"time","start":0,"end":4},
                    //  {"token":4,"start":5,"end":6},
                    //  {"token":0,"data":"log","start":7,"end":10}]
	
		        	var streamdef = eatStream();
		        	$log.info('JSParse: parsed to '+JSON.stringify(streamdef));
		        	// streamDef = {"modules":[{"name":"time","start":0,"end":4},{"name":"log","start":7,"end":10}]}
		        	
		        	// {"lines":[{"errors":null,"success":
		        	// [{"group":"UNKNOWN_1","label":"time","type":"source","name":"time","options":{},"sourceChannelName":null,"sinkChannelName":null},{"group":"UNKNOWN_1","label":"log","type":"sink","name":"log","options":{},"sourceChannelName":null,"sinkChannelName":null}]
		        	// }],"links":[]}
		        	
		        	var streamName = streamdef.name?streamdef.name:'UNKNOWN_'+lineNumber;
		        	var success = [];
		        	if (streamdef.modules) {
						var alreadySeen = {};
		        		for (var m=0;m<streamdef.modules.length;m++) {
		        			var expectedType = 'processor';
		        			if (m === 0 && !streamdef.sourceChannel) {
		        				expectedType = 'source';
		        			}
		        			if (m === (streamdef.modules.length-1) && !streamdef.sourceChannel) {
		        				expectedType = 'sink';
		        			}
				        	var sourceChannelName = null;
				        	if (m === 0 && streamdef.sourceChannel) {
				        		sourceChannelName = streamdef.sourceChannel.channel.name;
				        	}
				        	var sinkChannelName = null;
				        	if (m===streamdef.modules.length-1 && streamdef.sinkChannel) {
				        		sinkChannelName = streamdef.sinkChannel.channel.name;
				        	}
		        			var module = streamdef.modules[m];
		        			var uglyObject = {};
		        			uglyObject.group=streamName;
		        			if (module.label) {
		        				uglyObject.label = module.label;
		        			}
		        			uglyObject.type = expectedType;
	        				uglyObject.name = module.name;
	        				uglyObject.range = {'start':{'ch':module.start,'line':lineNumber},'end':{'ch':module.end,'line':lineNumber}};
	        				var options = {};
	        				var optionsranges = {};
	        				if (module.options) {
	        					options = {};
	        					optionsranges = {};
	        					for (var o=0;o<module.options.length;o++) {
	        						var option = module.options[o];
	        						options[option.name]=option.value;
	        						optionsranges[option.name]={'start':{'ch':option.start,'line':lineNumber},'end':{'ch':option.end,'line':lineNumber}};
	        					}
	        				}
	    					uglyObject.options=options;
	    					uglyObject.optionsranges = optionsranges;
							uglyObject.sourceChannelName = sourceChannelName;
							uglyObject.sinkChannelName = sinkChannelName;
				        	success.push(uglyObject);

				        	var nameToCheck = uglyObject.label?uglyObject.label:uglyObject.name;
							// Check that each module has a unique label (either explicit or implicit)
							var previous = alreadySeen[nameToCheck];
							if (typeof previous === 'number') {
								recordError(streamdef, {
									'msg': module.label ?
										'Label \'' + module.label + '\' should be unique but module \'' + module.name + '\' (at position ' + m + ') and module \'' + streamdef.modules[previous].name + '\' (at position ' + previous + ') both use it'
										: 'Module \'' + module.name + '\' should be unique within the stream, use a label to differentiate multiple occurrences',
									'range': uglyObject.range
								});
							} else {
								alreadySeen[nameToCheck] = m;
							}
		        		}
		        	} else {
		        		// error case: 'tap:stream:foo >'
		        		// there is no target for the tap yet
		        		if (streamdef.sourceChannel) {
		        			// need to build a dummy module to hang the sourcechannel off
		        			var obj = {};
		        			obj.sourceChannelName = streamdef.sourceChannel.channel.name;
		        			success.push(obj);
		        		}
		        	}
 		        	line.success = success;	  
		        	
		        	if (streamdef.errors) {
		        		line.errors = [];
		        		for (var e=0;e<streamdef.errors.length;e++) {
		        			var error = streamdef.errors[e];
		        			errorToRecord = {};
		        			errorToRecord.accurate = true;
		        			errorToRecord.message = error.msg;
							if (error.range) {
								errorToRecord.range = error.range;
							} else {
								start = error.start;
								end = typeof error.end === 'number' ? error.end : start+1;
								errorToRecord.range = {'start':{'ch':start,'line':lineNumber},'end':{'ch':end,'line':lineNumber}};
							}
		        			line.errors.push(errorToRecord);
		        		}
		        	}        	
		        	$log.info('JSParse: translated to '+JSON.stringify(line));
		        	lines.push(line);
		    	} catch (err) { 
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
							end = typeof err.end === 'number' ? err.end : start+1;
							errorToRecord.range = {'start':{'ch':start,'line':lineNumber},'end':{'ch':end,'line':lineNumber}};
						}
	        			line.errors.push(errorToRecord);
	        			lines.push(line);

		        		var str= '';
		        		for (var i=0;i<err.start;i++) {
		        			str+=' ';
		        		}
		        		str+='^';
		        		$log.error(str);
		        		$log.error(err.msg);
	        		} else {
	        			$log.error(err);
	        		}
	        	}
        	}
        	$log.info('JSParse: final lines: '+JSON.stringify(lines));
        	return {'lines':lines};
        }

        return {
        	parse: parse
        };
		
	}];
	
});
