/*
 * Copyright 2016 the original author or authors.
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

export enum TokenKind {
    IDENTIFIER = '<IDENTIFIER>',
    DOUBLE_MINUS = '--',
    EQUALS = '=',
    AND = '&',
    PIPE = '|',
    DOUBLE_PIPE = '||',
    NEWLINE = '<NEWLINE>',
    COLON = ':',
    GT = '>',
    SEMICOLON = ';',
    // REFERENCE = '@',
    DOT = '.',
    SLASH = '/',
    STAR = '*',
    HASH = '#',
    LITERAL_STRING = '<LITERAL_STRING>',
    EOF = '<EOF>',
    COMMA = ','
}

export interface Token {
    kind: TokenKind;
    data?: string; // Only some tokens have a non fixed payload that needs to be included here
    start: number;
    end: number;
}

/**
 * Parse a textual stream definition.
 *
 * @author Andy Clement
 * @author Alex Boyko
 */
class Tokenizer {

    private tokens: Token[] = [];
    private toProcess: string;
    private justProcessedEquals = false;
    private haveSeenOptionQualifier = false;
    private max: number;
    private pos = 0;

    constructor(text: string) {
        this.toProcess = text + '\0';
        this.max = text.length;
    }

    private isQuote(ch: string): boolean {
        return ch === '\'' || ch === '"';
    }

    private isWhitespace(ch: string): boolean {
        return ch === ' ' || ch === '\t' || ch === '\r' || ch === '\n';
    }

    private isDigit(ch: string): boolean {
        if (ch.charCodeAt(0) > 255) {
            return false;
        }
        return ch >= '0' && ch <= '9';
    }

    private isAlphabetic(ch: string): boolean {
        if (ch.charCodeAt(0) > 255) {
            return false;
        }
        return (ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z');
    }

    private subarray(start: number, end: number): string {
        return this.toProcess.substring(start, end);
    }

    private sameQuotes(pos1: number, pos2: number): boolean {
        if (this.toProcess[pos1] === '\'') {
            return this.toProcess[pos2] === '\'';
        } else if (this.toProcess[pos1] === '"') {
            return this.toProcess[pos2] === '"';
        }
        return false;
    }

    private isArgValueIdentifierTerminator(ch: string, quoteOpen: boolean): boolean {
        return (ch === '|' && !quoteOpen) || (ch === ';' && !quoteOpen) || ch === '\0' || (ch === ' ' && !quoteOpen) ||
            (ch === '\t' && !quoteOpen) || (ch === '>' && !quoteOpen) ||
            ch === '\r' || ch === '\n';
    }

    // ID: ('a'..'z'|'A'..'Z'|'_'|'$') ('a'..'z'|'A'..'Z'|'_'|'$'|'0'..'9'|DOT_ESCAPED|'-')*;
    private isIdentifier(ch: string): boolean {
        return this.isAlphabetic(ch) || this.isDigit(ch) || ch === '_' || ch === '$' || ch === '-';
    }

    /**
     * Lex a string literal which uses single quotes as delimiters. To include a single quote within the literal, use a
     * pair ''
     */
    private lexQuotedStringLiteral() {
        const start = this.pos;
        let terminated = false;
        while (!terminated) {
            this.pos++;
            const ch = this.toProcess[this.pos];
            if (ch === '\'') {
                // may not be the end if the char after is also a '
                if (this.toProcess[this.pos + 1] === '\'') {
                    this.pos++; // skip over that too, and continue
                } else {
                    terminated = true;
                }
            }
            if (this.pos >= this.max) {
                throw {'msg': 'TokenizationError: non terminating quoted string', 'start': start, 'end': this.pos};
            }
        }
        this.pos++;
        this.tokens.push({'kind': TokenKind.LITERAL_STRING, 'data': this.subarray(start, this.pos), 'start': start, 'end': this.pos});
    }

    private pushCharToken(tokenkind: TokenKind) {
        this.tokens.push({'kind': tokenkind,  'data': tokenkind, 'start': this.pos, 'end': this.pos + 1});
        this.pos++;
    }

    private pushPairToken(tokenkind: TokenKind) {
        this.tokens.push({'kind': tokenkind, 'start': this.pos, 'end': this.pos + 2});
        this.pos += 2;
    }

    /**
     * To prevent the need to quote all argument values, this identifier lexing function is used just after an '=' when
     * we are about to digest an arg value. It is much more relaxed about what it will include in the identifier.
     */
    private lexArgValueIdentifier() {
        // Much of the complexity in here relates to supporting cases like these:
        // 'hi'+payload
        // 'hi'+'world'
        // In these situations it looks like a quoted string and that perhaps the entire
        // argument value is being quoted, but in fact half way through it is discovered that the
        // entire value is not quoted, only the first part of the argument value is a string literal.

        const start = this.pos;
        let quoteOpen = false;
        let quoteClosedCount = 0; // Enables identification of this pattern: 'hello'+'world'
        let quoteInUse = null; // If set, indicates this is being treated as a quoted string
        if (this.isQuote(this.toProcess[this.pos])) {
            quoteOpen = true;
            quoteInUse = this.toProcess[this.pos++];
        }
        do {
            const ch = this.toProcess[this.pos];
            if ((quoteInUse !== null && ch === quoteInUse) || (quoteInUse === null && this.isQuote(ch))) {
                if (quoteInUse !== null && quoteInUse === '\'' && ch === '\'' && this.toProcess[this.pos + 1] === '\'') {
                    this.pos++; // skip over that too, and continue
                } else {
                    quoteOpen = !quoteOpen;
                    if (!quoteOpen) {
                        quoteClosedCount++;
                    }
                }
            }
            this.pos++;
        }
        while (this.pos < this.toProcess.length && !this.isArgValueIdentifierTerminator(this.toProcess[this.pos], quoteOpen));
        let data = null;
        if (quoteClosedCount < 2 && this.sameQuotes(start, this.pos - 1)) {
            this.tokens.push({'kind': TokenKind.LITERAL_STRING,
                    'data': this.subarray(start, this.pos), 'start': start, 'end': this.pos});
        } else {
            data = this.subarray(start, this.pos);
            this.tokens.push({'kind': TokenKind.IDENTIFIER, 'data': data, 'start': start, 'end': this.pos});
        }
    }

    /**
     * Lex a string literal which uses double quotes as delimiters. To include a single quote within the literal, use a
     * pair ""
     */
    private lexDoubleQuotedStringLiteral() {
        const start = this.pos;
        let terminated = false;
        while (!terminated) {
            this.pos++;
            const ch = this.toProcess[this.pos];
            if (ch === '"') {
                // may not be the end if the char after is also a "
                if (this.toProcess[this.pos + 1] === '"') {
                    this.pos++; // skip over that too, and continue
                } else {
                    terminated = true;
                }
            }
            if (this.pos >= this.max) {
                throw {'msg': 'TokenizationError: non terminating double quoted string', 'start': start, 'end': this.pos};
            }
        }
        this.pos++;
        this.tokens.push({'kind': TokenKind.LITERAL_STRING, 'data': this.subarray(start, this.pos), 'start': start, 'end': this.pos});
    }

    /**
     * For the variant tokenizer (used following an '=' to parse an argument value) we only terminate that identifier if
     * encountering a small set of characters. If the argument has included a ' to put something in quotes, we remember
     * that and don't allow ' ' (space) and '\t' (tab) to terminate the value.
     */
    private lexIdentifier() {
        const start = this.pos;
        do {
            this.pos++;
        }
        while (this.isIdentifier(this.toProcess[this.pos]));
        const data = this.subarray(start, this.pos);
        this.tokens.push({'kind': TokenKind.IDENTIFIER, 'data': data, 'start': start, 'end': this.pos});
    }

    /**
     * Check if this might be a two character token.
     */
    private isTwoCharToken(tokenkind: TokenKind): boolean {
        // assert tokenkind.value && tokenkind.value.length==2
        // assert toProcess.charAt(pos) == tokenkind.value.charAt(0);
        return this.toProcess.charAt(this.pos + 1) === tokenkind.charAt(1);
    }

    // private printTokenizerState() {
    // 	LoggerService.error('Tokenizer State. Input #'+this.max);
    // 	var output = '';
    // 	for (var i = 0; i < this.max; i++) {
    // 		output += this.toProcess.charAt(i) + '[' + this.toProcess.charCodeAt(i) + ']';
    // 	}
    // 	LoggerService.log(output);
    // 	LoggerService.log(this.pos);
    // }

    public tokenize(): Token[] {
        while (this.pos < this.max) {
            const ch = this.toProcess.charAt(this.pos);
            if (this.justProcessedEquals) { // if in this pattern --foo=bar
                if (!this.isWhitespace(ch) && ch.charCodeAt(0) !== 0 && this.haveSeenOptionQualifier) {
                    // following an '=' we commence a variant of regular tokenization
                    // consuming everything up to the next special char.
                    // This allows SpEL expressions to be used without quoting in many
                    // situations
                    // If the next char is a special char then the argument value is missing
                    if (this.isArgValueIdentifierTerminator(ch, false)) {
                        throw {'msg': 'expected argument value', 'start': this.pos};
                    }
                    this.lexArgValueIdentifier();
                }
                this.justProcessedEquals = false;
                continue;
            }
            if (this.isAlphabetic(ch) || this.isDigit(ch) || ch === '_') {
                this.lexIdentifier();
            } else {
                switch (ch) {
                case '-':
                    if (!this.isTwoCharToken(TokenKind.DOUBLE_MINUS)) {
                        throw {'msg': 'TokenizationError: expected two hyphens: \'--\'', 'start': this.pos, 'end': this.pos + 1};
                    }
                    this.pushPairToken(TokenKind.DOUBLE_MINUS);
                    this.haveSeenOptionQualifier = true;
                    break;
                case '=':
                    this.justProcessedEquals = true;
                    this.pushCharToken(TokenKind.EQUALS);
                    break;
                case '&':
                    this.pushCharToken(TokenKind.AND);
                    break;
                case '|':
                    if (this.isTwoCharToken(TokenKind.DOUBLE_PIPE)) {
                        this.pushPairToken(TokenKind.DOUBLE_PIPE);
                    } else {
                        this.pushCharToken(TokenKind.PIPE);
                    }
                    break;
                case ' ':
                case '\t':
                case '\r':
                    this.pos++;
                    break;
                case '\n':
                    this.pushCharToken(TokenKind.NEWLINE);
                    break;
                case '.':
                    this.pushCharToken(TokenKind.DOT);
                    break;
                case '>':
                    this.pushCharToken(TokenKind.GT);
                    break;
                case ',':
                    this.pushCharToken(TokenKind.COMMA);
                    break;
                case ':':
                    this.pushCharToken(TokenKind.COLON);
                    break;
                case '/':
                    this.pushCharToken(TokenKind.SLASH);
                    break;
                case '*':
                    this.pushCharToken(TokenKind.STAR);
                    break;
                case '#':
                    this.pushCharToken(TokenKind.HASH);
                    break;
                case ';':
                    this.pushCharToken(TokenKind.SEMICOLON);
                    break;
                case '\'':
                    this.lexQuotedStringLiteral();
                    break;
                case '"':
                    this.lexDoubleQuotedStringLiteral();
                    break;
                case '\0':
                    // hit sentinel at end of char data
                    this.pos++; // will take us to the end
                    break;
                case '\\':
                    throw {'msg': 'TokenizationError: Unexpected escape char', 'start': this.pos, 'end': this.pos + 1};
                default:
                    throw {'msg': 'TokenizationError: Unexpected character', 'start': this.pos, 'end': this.pos + 1};
                }
            }
        }
        return this.tokens;
    }
}

export function tokenize(text: string): Token[] {
    return new Tokenizer(text).tokenize();
}
