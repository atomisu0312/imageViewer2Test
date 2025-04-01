import { useNumberSelect } from '../common/useNumberSelect';
import { ZoomLevelType, DEFAULT_VALUES } from '@/types/pixel';

export const useZoom = (initialZoom?: ZoomLevelType) => {
  const inputProps = useNumberSelect(initialZoom ?? DEFAULT_VALUES.zoom);

  return {
    value: inputProps.value as ZoomLevelType,
    onChange: inputProps.onChange
  };
}; 