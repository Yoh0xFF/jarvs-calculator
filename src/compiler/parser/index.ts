import { Lexer } from '../lexer';
import { Expression } from '../model';
import { ParserInterface } from './interface';
import { PrattParser } from './pratt-parser';
import { RecursiveDescentParser } from './recursive-descent-parser';

export type ParserType = 'Recursive' | 'Pratt';

export class Parser implements ParserInterface {
  private parser: ParserInterface;

  constructor(
    public lexer: Lexer,
    type: ParserType = 'Recursive',
  ) {
    switch (type) {
      case 'Recursive':
        this.parser = new RecursiveDescentParser(lexer);
        break;
      case 'Pratt':
        this.parser = new PrattParser(lexer);
        break;
      default:
        this.parser = new RecursiveDescentParser(lexer);
    }
  }

  parseExpression(): Expression {
    return this.parser.parseExpression();
  }
}
