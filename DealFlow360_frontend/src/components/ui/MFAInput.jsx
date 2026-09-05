import React, { useEffect, useRef, useState } from 'react';

export const MFAInput = ({
  length = 6,
  onComplete,
  portal = 'customer',
  disabled = false,
}) => {
  const [code, setCode] = useState(Array(length).fill(''));
  const inputRefs = useRef([]);

  const isCustomer = portal === 'customer';
  const activeRing = isCustomer
    ? 'focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20'
    : 'focus:border-[#714B67] focus:ring-2 focus:ring-[#714B67]/20';

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value.substring(value.length - 1);
    setCode(newCode);

    const fullCode = newCode.join('');
    if (fullCode.length === length && !newCode.includes('')) {
      onComplete(fullCode);
    }

    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (!/^\d+$/.test(pastedData)) return;

    const digits = pastedData.slice(0, length).split('');
    const newCode = [...code];

    digits.forEach((digit, i) => {
      newCode[i] = digit;
      if (inputRefs.current[i]) {
        inputRefs.current[i].value = digit;
      }
    });

    setCode(newCode);
    if (digits.length === length) {
      onComplete(digits.join(''));
      inputRefs.current[length - 1]?.focus();
    } else if (digits.length < length) {
      inputRefs.current[digits.length]?.focus();
    }
  };

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-3 my-4">
      {code.map((digit, index) => (
        <input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={digit}
          disabled={disabled}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          className={`w-10 h-12 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-mono font-bold text-slate-900 bg-white border border-slate-300 rounded-xl shadow-xs transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${activeRing}`}
          aria-label={`Digit ${index + 1}`}
        />
      ))}
    </div>
  );
};
