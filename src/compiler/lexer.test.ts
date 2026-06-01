import { describe, expect, it } from 'vitest';
import { Lexer, LexerType } from './lexer';

describe('Test LexerWithRegex', () => {
  runTests('Regex');
});

describe('Test LexerWithScanner', () => {
  runTests('Scanner');
});

function runTests(type: LexerType) {
  it('parse term operators', () => {
    const lexer = new Lexer('7 + 9 - 7', type);
    expect(lexer.nextToken()).toEqual({
      index: 0,
      type: 'Operand',
      value: '7',
    });
    expect(lexer.nextToken()).toEqual({
      index: 2,
      type: 'Operator+',
      value: '+',
    });
    expect(lexer.nextToken()).toEqual({
      index: 4,
      type: 'Operand',
      value: '9',
    });
    expect(lexer.nextToken()).toEqual({
      index: 6,
      type: 'Operator-',
      value: '-',
    });
    expect(lexer.nextToken()).toEqual({
      index: 8,
      type: 'Operand',
      value: '7',
    });
  });

  it('parse factor operators', () => {
    const lexer = new Lexer('7 * 9 / 7', type);
    expect(lexer.nextToken()).toEqual({
      index: 0,
      type: 'Operand',
      value: '7',
    });
    expect(lexer.nextToken()).toEqual({
      index: 2,
      type: 'Operator*',
      value: '*',
    });
    expect(lexer.nextToken()).toEqual({
      index: 4,
      type: 'Operand',
      value: '9',
    });
    expect(lexer.nextToken()).toEqual({
      index: 6,
      type: 'Operator/',
      value: '/',
    });
    expect(lexer.nextToken()).toEqual({
      index: 8,
      type: 'Operand',
      value: '7',
    });
  });

  it('parse float numbers', () => {
    const lexer = new Lexer('7.9 * 9.7', type);
    expect(lexer.nextToken()).toEqual({
      index: 0,
      type: 'Operand',
      value: '7.9',
    });
    expect(lexer.nextToken()).toEqual({
      index: 4,
      type: 'Operator*',
      value: '*',
    });
    expect(lexer.nextToken()).toEqual({
      index: 6,
      type: 'Operand',
      value: '9.7',
    });
  });

  it('skip whitespace', () => {
    const lexer = new Lexer(' 7   * \t\n  9 \n ', type);
    expect(lexer.nextToken()).toEqual({
      index: 1,
      type: 'Operand',
      value: '7',
    });
    expect(lexer.nextToken()).toEqual({
      index: 5,
      type: 'Operator*',
      value: '*',
    });
    expect(lexer.nextToken()).toEqual({
      index: 11,
      type: 'Operand',
      value: '9',
    });
  });

  it('parse group expression', () => {
    const lexer = new Lexer('(7 + 9) * 11', type);
    expect(lexer.nextToken()).toEqual({
      index: 0,
      type: 'Parenthesis(',
      value: '(',
    });
    expect(lexer.nextToken()).toEqual({
      index: 1,
      type: 'Operand',
      value: '7',
    });
    expect(lexer.nextToken()).toEqual({
      index: 3,
      type: 'Operator+',
      value: '+',
    });
    expect(lexer.nextToken()).toEqual({
      index: 5,
      type: 'Operand',
      value: '9',
    });
    expect(lexer.nextToken()).toEqual({
      index: 6,
      type: 'Parenthesis)',
      value: ')',
    });
    expect(lexer.nextToken()).toEqual({
      index: 8,
      type: 'Operator*',
      value: '*',
    });
    expect(lexer.nextToken()).toEqual({
      index: 10,
      type: 'Operand',
      value: '11',
    });
  });

  it('parse complex expression', () => {
    const lexer = new Lexer('(1 + 4) * 5 / (10 + -5)', type);
    expect(lexer.nextToken()).toEqual({
      index: 0,
      type: 'Parenthesis(',
      value: '(',
    });
    expect(lexer.nextToken()).toEqual({
      index: 1,
      type: 'Operand',
      value: '1',
    });
    expect(lexer.nextToken()).toEqual({
      index: 3,
      type: 'Operator+',
      value: '+',
    });
    expect(lexer.nextToken()).toEqual({
      index: 5,
      type: 'Operand',
      value: '4',
    });
    expect(lexer.nextToken()).toEqual({
      index: 6,
      type: 'Parenthesis)',
      value: ')',
    });
    expect(lexer.nextToken()).toEqual({
      index: 8,
      type: 'Operator*',
      value: '*',
    });
    expect(lexer.nextToken()).toEqual({
      index: 10,
      type: 'Operand',
      value: '5',
    });
    expect(lexer.nextToken()).toEqual({
      index: 12,
      type: 'Operator/',
      value: '/',
    });
    expect(lexer.nextToken()).toEqual({
      index: 14,
      type: 'Parenthesis(',
      value: '(',
    });
    expect(lexer.nextToken()).toEqual({
      index: 15,
      type: 'Operand',
      value: '10',
    });
    expect(lexer.nextToken()).toEqual({
      index: 18,
      type: 'Operator+',
      value: '+',
    });
    expect(lexer.nextToken()).toEqual({
      index: 20,
      type: 'Operator-',
      value: '-',
    });
    expect(lexer.nextToken()).toEqual({
      index: 21,
      type: 'Operand',
      value: '5',
    });
    expect(lexer.nextToken()).toEqual({
      index: 22,
      type: 'Parenthesis)',
      value: ')',
    });
  });

  it('throw error for invalid expression', () => {
    expect(() => {
      const lexer = new Lexer('7.9.1 + 9', type);
      lexer.nextToken();
      lexer.nextToken();
    }).toThrow("Invalid expression, unknow character '.' at index 3");
  });
}
