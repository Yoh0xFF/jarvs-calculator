import { describe, expect, it } from 'vitest';
import { evaluateExpression } from './interpreter';
import { Lexer, LexerType } from './lexer';
import { Parser, ParserType } from './parser';

describe('Test Interpreter with Regex lexer and Recursive parser', () => {
  runTests('Regex', 'Recursive');
});

describe('Test Interpreter with Regex lexer and Pratt parser', () => {
  runTests('Regex', 'Pratt');
});

describe('Test Interpreter with Scanner lexer and Recursive parser', () => {
  runTests('Scanner', 'Recursive');
});

describe('Test Interpreter with Scanner lexer and Pratt parser', () => {
  runTests('Scanner', 'Pratt');
});

function runTests(lexerType: LexerType, parserType: ParserType) {
  it('evaluate term operators', () => {
    const parser = new Parser(
      new Lexer('7.2 + 9 - 7.2', lexerType),
      parserType,
    );
    expect(evaluateExpression(parser.parseExpression())).toBe(9);
  });

  it('parse factor operators', () => {
    const parser = new Parser(new Lexer('7 * 9 / 7', lexerType), parserType);
    expect(evaluateExpression(parser.parseExpression())).toBe(9);
  });

  it('correctly parse operator precedence', () => {
    const parser = new Parser(new Lexer('7.2 + 9 * 7', lexerType), parserType);
    expect(evaluateExpression(parser.parseExpression())).toBe(70.2);
  });

  it('parse group expression', () => {
    const parser = new Parser(new Lexer('(5 + 9) / 2', lexerType), parserType);
    expect(evaluateExpression(parser.parseExpression())).toBe(7);
  });

  it('correctly parse unary operator precedence', () => {
    const parser = new Parser(new Lexer('5 * -5', lexerType), parserType);
    expect(evaluateExpression(parser.parseExpression())).toBe(-25);
  });

  it('correctly parse complex expression', () => {
    const parser = new Parser(
      new Lexer('(1 + 4) * 5 / (10 + -5)', lexerType),
      parserType,
    );
    expect(evaluateExpression(parser.parseExpression())).toBe(5);
  });

  it('throw error on division by zero', () => {
    const parser = new Parser(
      new Lexer('(1 + 4) * 5 / (5 + -5)', lexerType),
      parserType,
    );
    expect(() => evaluateExpression(parser.parseExpression())).toThrow(
      'Division by zero',
    );
  });
}
