import { Token } from '../model';
import { LexerInterface } from './interface';
import { RegexLexer } from './regex-lexer';
import { ScannerLexer } from './scanner-lexer';

export type LexerType = 'Regex' | 'Scanner';

export class Lexer implements LexerInterface {
  private lexer: LexerInterface;

  constructor(
    public expression: string,
    type: LexerType = 'Regex',
  ) {
    switch (type) {
      case 'Regex':
        this.lexer = new RegexLexer(this.expression);
        break;
      case 'Scanner':
        this.lexer = new ScannerLexer(this.expression);
        break;
      default:
        this.lexer = new RegexLexer(this.expression);
    }
  }

  nextToken(): Token {
    return this.lexer.nextToken();
  }
}
