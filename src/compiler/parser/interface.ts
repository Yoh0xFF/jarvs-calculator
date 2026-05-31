import { Lexer } from '../lexer';
import { Expression } from '../model';

export interface ParserInterface {
  lexer: Lexer;

  parseExpression(): Expression;
}
