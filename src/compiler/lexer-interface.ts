import { Token } from './ast';

export interface LexerInterface {
  expression: string;

  nextToken(): Token;
}
