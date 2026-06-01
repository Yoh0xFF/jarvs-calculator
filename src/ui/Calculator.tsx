import React, { useRef, useState } from 'react';
import { evaluateExpression } from '../compiler/interpreter';
import { Lexer } from '../compiler/lexer';
import { Parser } from '../compiler/parser';
import './Calculator.css';

type ButtonConfig = {
  label: string;
  value: string;
  wide?: boolean;
};

const buttonLayout: ButtonConfig[][] = [
  [
    { label: '⌫', value: 'backspace' },
    { label: '(', value: '(' },
    { label: ')', value: ')' },
    { label: '/', value: '/' },
  ],
  [
    { label: '7', value: '7' },
    { label: '8', value: '8' },
    { label: '9', value: '9' },
    { label: '*', value: '*' },
  ],
  [
    { label: '4', value: '4' },
    { label: '5', value: '5' },
    { label: '6', value: '6' },
    { label: '-', value: '-' },
  ],
  [
    { label: '1', value: '1' },
    { label: '2', value: '2' },
    { label: '3', value: '3' },
    { label: '+', value: '+' },
  ],
  [
    { label: '0', value: '0', wide: true },
    { label: '.', value: '.' },
    { label: '=', value: '=' },
  ],
];

export function Calculator() {
  const [expression, setExpression] = useState('');
  const [pressedButton, setPressedButton] = useState<string | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleButtonClick = (value: string) => {
    inputRef.current?.focus();
    setPressedButton(value);
    setTimeout(() => setPressedButton(null), 180);

    if (value === '=') {
      const collapsed = expression.replace(/\n/g, '');
      if (collapsed.trim() === '') {
        return;
      }
      try {
        const lexer = new Lexer(collapsed);
        const parser = new Parser(lexer);
        const ast = parser.parseExpression();
        const result = evaluateExpression(ast);
        setExpression(String(result));
      } catch {
        setExpression('Error');
      }
      return;
    }

    if (value === 'backspace') {
      setExpression((prev) => prev.slice(0, -1));
      return;
    }

    setExpression((prev) => prev + value);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setExpression(e.target.value.replace(/[^0-9+\-*/().\n]/g, ''));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Backspace' || e.key === 'Delete') {
      setPressedButton('backspace');
      setTimeout(() => setPressedButton(null), 180);
      return;
    }

    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      setPressedButton('=');
      setTimeout(() => setPressedButton(null), 180);
      handleButtonClick('=');
      return;
    }

    const allButtonValues = buttonLayout.flat().map((b) => b.value);
    if (allButtonValues.includes(e.key)) {
      setPressedButton(e.key);
      setTimeout(() => setPressedButton(null), 180);
    }
  };

  return (
    <div className='calculator'>
      <textarea
        className='display'
        value={expression}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder='0'
        ref={inputRef}
        autoFocus
        spellCheck={false}
        data-gramm='false'
        data-gramm_editor='false'
      />

      <div className='buttons'>
        {buttonLayout.flat().map((button) => (
          <button
            key={button.value}
            className={[
              'button',
              button.wide ? 'wide' : '',
              button.value === '=' ? 'equals' : '',
              '0123456789.'.includes(button.value) ? 'number' : 'operator',
              pressedButton === button.value ? 'pressed' : '',
            ]
              .filter(Boolean)
              .join(' ')}
            onClick={() => handleButtonClick(button.value)}>
            {button.label}
          </button>
        ))}
      </div>
    </div>
  );
}
