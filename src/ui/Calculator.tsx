import React, { useState } from 'react';
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
  const [pressedButton, setPressedButton] = useState<string | null>(null);

  const handleButtonClick = (value: string) => {
    setPressedButton(value);
    setTimeout(() => setPressedButton(null), 180);

    if (value === '=') {
      // TODO: evaluate expression
      return;
    }
    setExpression((prev) => prev + value);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setExpression(e.target.value.replace(/[^0-9+\-*/().]/g, ''));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const key = e.key === 'Enter' ? '=' : e.key;

    const allButtonValues = buttonLayout.flat().map((b) => b.value);
    if (allButtonValues.includes(key)) {
      setPressedButton(key);
      setTimeout(() => setPressedButton(null), 180);
    }

    if (e.key === 'Enter') {
      handleButtonClick('=');
    }
  };

  return (
    <div className='calculator'>
      <input
        className='display'
        type='text'
        value={expression}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder='0'
        autoFocus
      />

      <div className='buttons'>
        {buttonLayout.map((row, rowIndex) => (
          <div key={rowIndex} className='row'>
            {row.map((button) => (
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
        ))}
      </div>
    </div>
  );
}
