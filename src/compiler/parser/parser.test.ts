import { describe, expect, it } from 'vitest';
import { Lexer } from '../lexer';
import { Parser, ParserType } from './index';

describe('Test PrattParser', () => {
  runTests('Pratt');
});

describe('Test RecursiveDescentParser', () => {
  runTests('Recursive');
});

function runTests(type: ParserType) {
  it('parse term operators', () => {
    const parser = new Parser(new Lexer('7 + 9 - 7'), type);
    expect(parser.parseExpression()).toEqual({
      type: 'Binary',
      left: {
        type: 'Binary',
        left: { type: 'Literal', value: 7 },
        operator: '+',
        right: { type: 'Literal', value: 9 },
      },
      operator: '-',
      right: { type: 'Literal', value: 7 },
    });
  });

  it('parse factor operators', () => {
    const parser = new Parser(new Lexer('7 * 9 / 7'), type);
    expect(parser.parseExpression()).toEqual({
      type: 'Binary',
      left: {
        type: 'Binary',
        left: { type: 'Literal', value: 7 },
        operator: '*',
        right: { type: 'Literal', value: 9 },
      },
      operator: '/',
      right: { type: 'Literal', value: 7 },
    });
  });

  it('correctly parse operator precedence', () => {
    const parser = new Parser(new Lexer('7 + 9 * 7'), type);
    expect(parser.parseExpression()).toEqual({
      type: 'Binary',
      left: { type: 'Literal', value: 7 },
      operator: '+',
      right: {
        type: 'Binary',
        left: { type: 'Literal', value: 9 },
        operator: '*',
        right: { type: 'Literal', value: 7 },
      },
    });
  });

  it('parse group expression', () => {
    const parser = new Parser(new Lexer('(5 + 9) / 2'), type);
    expect(parser.parseExpression()).toEqual({
      type: 'Binary',
      left: {
        type: 'Group',
        expression: {
          type: 'Binary',
          left: { type: 'Literal', value: 5 },
          operator: '+',
          right: { type: 'Literal', value: 9 },
        },
      },
      operator: '/',
      right: { type: 'Literal', value: 2 },
    });
  });

  it('correctly parse unary operator precedence', () => {
    const parser = new Parser(new Lexer('5 * -5'), type);
    expect(parser.parseExpression()).toEqual({
      type: 'Binary',
      left: { type: 'Literal', value: 5 },
      operator: '*',
      right: {
        type: 'Unary',
        operator: '-',
        right: { type: 'Literal', value: 5 },
      },
    });
  });

  it('correctly parse complex expression', () => {
    const parser = new Parser(new Lexer('(1 + 4) * 5 / (10 + -5)'), type);
    expect(parser.parseExpression()).toEqual({
      type: 'Binary',
      left: {
        type: 'Binary',
        left: {
          type: 'Group',
          expression: {
            type: 'Binary',
            left: { type: 'Literal', value: 1 },
            operator: '+',
            right: { type: 'Literal', value: 4 },
          },
        },
        operator: '*',
        right: { type: 'Literal', value: 5 },
      },
      operator: '/',
      right: {
        type: 'Group',
        expression: {
          type: 'Binary',
          left: { type: 'Literal', value: 10 },
          operator: '+',
          right: {
            type: 'Unary',
            operator: '-',
            right: { type: 'Literal', value: 5 },
          },
        },
      },
    });
  });

  it('throw error for invalid parentheses', () => {
    const parser = new Parser(new Lexer('(1 + 4( * 5'), type);
    expect(() => parser.parseExpression()).toThrow(
      "Invalid expression, unknow character '(' at index 6",
    );
  });

  it('throw error for missing right parentheses', () => {
    const parser = new Parser(new Lexer('(1 + 4 * 5'), type);
    expect(() => parser.parseExpression()).toThrow(
      "Invalid expression, unknow character ';' at index 10",
    );
  });

  it('throw error for missing left parentheses', () => {
    const parser = new Parser(new Lexer('1 + 4) * 5'), type);
    expect(() => parser.parseExpression()).toThrow(
      "Invalid expression, unknow character ')' at index 5",
    );
  });

  it('throw error for invalid unary operator', () => {
    const parser = new Parser(new Lexer('1 + *5'), type);
    expect(() => parser.parseExpression()).toThrow(
      "Invalid expression, unknow character '*' at index 4",
    );
  });
}
