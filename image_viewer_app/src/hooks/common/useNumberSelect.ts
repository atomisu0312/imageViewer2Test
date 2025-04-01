import { useState, useCallback } from 'react';

export const useNumberSelect = (initialValue: number) => {
  const [value, setValue] = useState<number>(initialValue);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = parseInt(e.target.value);
    setValue(newValue);
  }, []);

  const inputProps = {
    value: value,
    onChange: handleChange
  };

  return inputProps;
}; 