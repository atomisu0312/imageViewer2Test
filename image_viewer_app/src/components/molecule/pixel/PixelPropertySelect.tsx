import React from 'react';

interface Option<T extends string | number> {
  readonly value: T;
  readonly label: string;
}

interface PixelPropertySelectProps<T extends string | number> {
  readonly label: string;
  readonly value: T;
  readonly options: readonly Option<T>[];
  readonly onChange: (value: T) => void;
}

const PixelPropertySelect = <T extends string | number>({
  label,
  value,
  options,
  onChange,
}: Readonly<PixelPropertySelectProps<T>>) => {
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
};

export default PixelPropertySelect; 