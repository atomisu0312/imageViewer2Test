import { useSelector } from 'react-redux'
import { RootState, useAppDispatch } from '@/store/store'
import { invertIsDetailOpen } from '@/store/imageViewSlice'

export default function DetailSubWindow() {
  const isDetailOpen = useSelector((state: RootState) => state.isDetailOpenSlice.value);
  const dispatch = useAppDispatch()

  return (
    <div>
      <button onClick={() => dispatch(invertIsDetailOpen())} > BOTROT </button>
      {isDetailOpen ? <span>true</span> : <></>}
    </div>
  )
}