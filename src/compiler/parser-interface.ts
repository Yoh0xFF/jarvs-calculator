import { Expression } from './ast';
import { Lexer } from './lexer';

export interface ParserInterface {
  lexer: Lexer;

  parseExpression(): Expression;
}
