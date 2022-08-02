import React from 'react';
import './text-input.module.scss';

/* eslint-disable-next-line */
export interface TextInputProps {
  placeholder?: string;
  value?: string;
  onChange?: (s: string) => void;
  onEnter?: () => void;
}

export function TextInput({
  placeholder,
  value,
  onChange,
  onEnter,
}: TextInputProps) {
  const onKeyPress = (event: React.KeyboardEvent) => {
    if (onEnter && event.key === 'Enter') {
      onEnter();
    }
  };

  return (
    <input
      className="rounded outline-0 ring-inset ring-1 ring-slate-200 bg-slate-50 hover:ring-slate-400 dark:ring-slate-700 dark:bg-slate-900"
      type="text"
      placeholder={placeholder}
      value={value}
      autoFocus
      onChange={(e) => onChange && onChange(e.target.value)}
      onKeyPress={onKeyPress}
    />
  );
}

export default TextInput;
