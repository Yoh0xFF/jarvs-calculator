import { Token } from '../model';

export interface LexerInterface {
  expression: string;

  nextToken(): Token;
}
