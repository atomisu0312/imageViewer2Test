import { useSelector } from 'react-redux'
import { RootState, useAppDispatch } from '@/store/store'
import { invertIsDetailOpen } from '@/store/imageViewSlice'

export default function DetailSubWindow() {
  const isDetailOpen = useSelector((state: RootState) => state.isDetailOpenSlice.value);
  const dispatch = useAppDispatch()

  return (
    // 左詰めにする
    <div className='justify-start'>
      <button onClick={() => dispatch(invertIsDetailOpen())} > BUTTON </button>
      {isDetailOpen ? <span>true</span> : <></>}
    </div>
  )
}