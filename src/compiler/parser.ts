import { Expression } from './ast';
import { Lexer } from './lexer';
import { ParserInterface } from './parser-interface';
import { ParserPratt } from './parser-pratt';
import { ParserRecursiveDescent } from './parser-recursive-descent';

export type ParserType = 'Recursive' | 'Pratt';

export class Parser implements ParserInterface {
  private parser: ParserInterface;

  constructor(
    public lexer: Lexer,
    type: ParserType = 'Recursive',
  ) {
    switch (type) {
      case 'Recursive':
        this.parser = new ParserRecursiveDescent(lexer);
        break;
      case 'Pratt':
        this.parser = new ParserPratt(lexer);
        break;
      default:
        this.parser = new ParserRecursiveDescent(lexer);
    }
  }

  parseExpression(): Expression {
    return this.parser.parseExpression();
  }
}
