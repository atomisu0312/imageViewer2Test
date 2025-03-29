import { useDetailOpen } from '@/hooks/useDetailOpen';

export default function DetailSubWindow() {
  const { isDetailOpen, toggleDetailOpen } = useDetailOpen();

  return (
    // 左詰めにする
    <div className='justify-start'>
      <button onClick={toggleDetailOpen}>BUTTON</button>
      {isDetailOpen ? <span>true</span> : <></>}
    </div>
  );
}