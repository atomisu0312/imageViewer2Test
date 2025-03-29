
import { memo } from 'react';
import { fileInfoType } from '@/types/fileInfoType';

interface DetailSubWindowProps {
  imageData: fileInfoType;
}

const DetailSubWindow = memo(function DetailSubWindow({ imageData }: DetailSubWindowProps) {

  return (
    // 左詰めにする
    <div className='justify-start'>
      <span>{imageData.text}</span>
    </div>
  );
})
export default DetailSubWindow; 