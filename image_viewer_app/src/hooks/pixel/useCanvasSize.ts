import { useNumberSelect } from '../common/useNumberSelect';
import { CanvasSizeType, DEFAULT_VALUES } from '@/types/pixel';

export const useCanvasSize = (initialSize?: CanvasSizeType) => {
  const inputProps = useNumberSelect(initialSize ?? DEFAULT_VALUES.canvasSize);

  return {
    value: inputProps.value as CanvasSizeType,
    onChange: inputProps.onChange
  };
}; 