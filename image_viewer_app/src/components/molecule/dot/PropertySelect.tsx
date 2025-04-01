import React from 'react';

interface Option<T extends string | number> {
  readonly value: T;
  readonly label: string;
}

interface PropertySelectProps<T extends string | number> {
  label: string;
  value: T;
  options: readonly Option<T>[];
  onChange: (value: T) => void;
}

export function PropertySelect<T extends string | number>({
  label,
  value,
  options,
  onChange,
}: PropertySelectProps<T>) {
  return (
    <div>
      <label className="block mb-2 text-white">{label}</label>
      <select 
        className="w-full p-2 rounded text-black bg-white"
        value={value}
        onChange={e => onChange(e.target.value as T)}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </div>
  );
} 