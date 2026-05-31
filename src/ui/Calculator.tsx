import { useState } from 'react';
import './Calculator.css';

type ButtonConfig = {
  label: string;
  value: string;
  wide?: boolean;
};

const buttonLayout: ButtonConfig[][] = [
  [
    { label: '(', value: '(' },
    { label: ')', value: ')' },
    { label: '/', value: '/' },
    { label: '*', value: '*' },
  ],
  [
    { label: '7', value: '7' },
    { label: '8', value: '8' },
    { label: '9', value: '9' },
    { label: '-', value: '-' },
  ],
  [
    { label: '4', value: '4' },
    { label: '5', value: '5' },
    { label: '6', value: '6' },
    { label: '+', value: '+' },
  ],
  [
    { label: '1', value: '1' },
    { label: '2', value: '2' },
    { label: '3', value: '3' },
    { label: '=', value: '=' },
  ],
  [
    { label: '0', value: '0', wide: true },
    { label: '.', value: '.' },
  ],
];

export function Calculator() {
  const [expression, setExpression] = useState('');

  function handleButtonClick(value: string) {
    if (value === '=') {
      // TODO: evaluate expression
      return;
    }
    setExpression((prev) => prev + value);
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setExpression(e.target.value.replace(/[^0-9+\-*/().]/g, ''));
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      handleButtonClick('=');
    }
  }

  return (
    <div className='calculator'>
      <input
        className='calculator-display'
        type='text'
        value={expression}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder='0'
        autoFocus
      />
      <div className='calculator-buttons'>
        {buttonLayout.map((row, rowIndex) => (
          <div key={rowIndex} className='calculator-row'>
            {row.map((btn) => (
              <button
                key={btn.value}
                className={[
                  'calculator-btn',
                  btn.wide ? 'calculator-btn-wide' : '',
                  btn.value === '=' ? 'calculator-btn-equals' : '',
                  '0123456789.'.includes(btn.value)
                    ? 'calculator-btn-number'
                    : 'calculator-btn-operator',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => handleButtonClick(btn.value)}>
                {btn.label}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
