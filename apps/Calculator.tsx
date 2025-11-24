import React, { useState } from 'react';

const Calculator: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');

  const handlePress = (val: string) => {
    if (val === '=') {
      try {
        // eslint-disable-next-line no-eval
        const res = eval(equation);
        setDisplay(String(res));
        setEquation(String(res));
      } catch {
        setDisplay('Error');
        setEquation('');
      }
    } else if (val === 'C') {
      setDisplay('0');
      setEquation('');
    } else {
      const newEq = equation === '0' ? val : equation + val;
      setEquation(newEq);
      setDisplay(newEq);
    }
  };

  const btnClass = "h-12 bg-gray-700 hover:bg-gray-600 rounded text-white font-bold transition-colors";
  const opClass = "h-12 bg-orange-500 hover:bg-orange-400 rounded text-white font-bold transition-colors";

  return (
    <div className="h-full bg-[#202020] p-4 flex flex-col">
      <div className="bg-[#303030] p-4 rounded mb-4 text-right">
        <div className="text-gray-400 text-xs h-4">{equation}</div>
        <div className="text-white text-3xl font-mono truncate">{display}</div>
      </div>
      <div className="grid grid-cols-4 gap-2 flex-1">
        {['7', '8', '9', '/'].map(x => <button key={x} onClick={() => handlePress(x)} className={['/'].includes(x) ? opClass : btnClass}>{x}</button>)}
        {['4', '5', '6', '*'].map(x => <button key={x} onClick={() => handlePress(x)} className={['*'].includes(x) ? opClass : btnClass}>{x}</button>)}
        {['1', '2', '3', '-'].map(x => <button key={x} onClick={() => handlePress(x)} className={['-'].includes(x) ? opClass : btnClass}>{x}</button>)}
        <button onClick={() => handlePress('0')} className={btnClass}>0</button>
        <button onClick={() => handlePress('.')} className={btnClass}>.</button>
        <button onClick={() => handlePress('C')} className="bg-red-600 hover:bg-red-500 h-12 rounded text-white font-bold">C</button>
        <button onClick={() => handlePress('+')} className={opClass}>+</button>
        <button onClick={() => handlePress('=')} className="col-span-4 bg-blue-600 hover:bg-blue-500 h-12 rounded text-white font-bold">=</button>
      </div>
    </div>
  );
};

export default Calculator;