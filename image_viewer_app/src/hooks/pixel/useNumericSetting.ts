import { useNumberSelect } from '../common/useNumberSelect';
import { NumericSettingType, DEFAULT_VALUES } from '@/types/pixel';

export const useNumericSetting = (type: NumericSettingType, initialValue: number) => {
  const defaultValue = DEFAULT_VALUES[type];
  const inputProps = useNumberSelect(initialValue || defaultValue);
  return inputProps;
}; 