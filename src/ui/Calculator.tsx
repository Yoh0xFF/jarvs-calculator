import { useEffect, useState } from 'react';
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

const allowedChars = new Set([
  '0',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '+',
  '-',
  '*',
  '/',
  '(',
  ')',
  '.',
]);

export function Calculator() {
  const [expression, setExpression] = useState('');
  const [pressedButton, setPressedButton] = useState<string | null>(null);

  const flash = (key: string) => {
    setPressedButton(key);
    setTimeout(() => setPressedButton(null), 180);
  };

  const handleButtonClick = (value: string) => {
    flash(value);

    if (value === '=') {
      setExpression(evaluate);
      return;
    }

    if (value === 'backspace') {
      setExpression((prev) => prev.slice(0, -1));
      return;
    }

    setExpression((prev) => prev + value);
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Backspace' || e.key === 'Delete') {
        flash('backspace');
        setExpression((prev) => prev.slice(0, -1));
        return;
      }

      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        flash('=');
        setExpression(evaluate);
        return;
      }

      if (e.key === 'Enter' && e.shiftKey) {
        setExpression((prev) => prev + '\n');
        return;
      }

      const allButtonValues = buttonLayout.flat().map((b) => b.value);
      if (allButtonValues.includes(e.key)) {
        flash(e.key);
      }

      if (e.key.length === 1 && allowedChars.has(e.key)) {
        setExpression((prev) => prev + e.key);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <div className='calculator'>
      <div className='display'>
        {expression === '' ? (
          <span className='placeholder'>0</span>
        ) : (
          expression
        )}
      </div>

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

function evaluate(prev: string): string {
  const collapsed = prev.replace(/\n/g, '');
  if (collapsed.trim() === '') {
    return prev;
  }

  try {
    const lexer = new Lexer(collapsed);
    const parser = new Parser(lexer);
    const ast = parser.parseExpression();
    return String(evaluateExpression(ast));
  } catch {
    return 'Error';
  }
}
