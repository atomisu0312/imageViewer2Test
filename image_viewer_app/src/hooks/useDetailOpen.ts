import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { invertIsDetailOpen } from '@/store/imageViewSlice';

export const useDetailOpen = () => {
  const isDetailOpen = useSelector((state: RootState) => state.isDetailOpenSlice.value);
  const dispatch = useDispatch();

  const toggleDetailOpen = () => {
    dispatch(invertIsDetailOpen());
  };

  return {
    isDetailOpen,
    toggleDetailOpen,
  };
}; 