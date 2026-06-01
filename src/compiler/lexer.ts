import { Token } from './ast';
import { LexerInterface } from './lexer-interface';
import { LexerRegex } from './lexer-regex';
import { LexerScanner } from './lexer-scanner';

export type LexerType = 'Regex' | 'Scanner';

export class Lexer implements LexerInterface {
  private lexer: LexerInterface;

  constructor(
    public expression: string,
    type: LexerType = 'Regex',
  ) {
    switch (type) {
      case 'Regex':
        this.lexer = new LexerRegex(this.expression);
        break;
      case 'Scanner':
        this.lexer = new LexerScanner(this.expression);
        break;
      default:
        this.lexer = new LexerRegex(this.expression);
    }
  }

  nextToken(): Token {
    return this.lexer.nextToken();
  }
}
