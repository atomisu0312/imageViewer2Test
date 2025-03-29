'use client'
import React, { memo } from 'react';
import { fileInfoType, NONE } from "@/types/fileInfoType"
import NoImageComponent from '@/components/molecule/noImageComponent';
import ImageLayout from '@/components/organism/image/imageLayout';
import { useDetailOpen } from '@/hooks/useDetailOpen';
import DetailSubWindow from '@/components/organism/image/detailSubWindow';

interface Props {
  data: fileInfoType
}

const ImageView = memo(function ImageView({ data }: Props) {
  const { isDetailOpen, toggleDetailOpen } = useDetailOpen();

  if (data == NONE) {
    return <NoImageComponent />
  }

  return (
    <div className="flex justify-center items-center mt-0">
      <div className="grid grid-cols-1 md:grid-cols-12 py-2">
        <div className={`${isDetailOpen ? "col-span-6" : "col-span-11"}`}>
          <ImageLayout imageUrl={data.imageUrl} />
        </div>
        <div className={`${isDetailOpen ? "col-span-6" : "col-span-1"} flex items-center`}>
          <button onClick={toggleDetailOpen}>BUTTON</button>
          <div style={{ display: isDetailOpen ? 'block' : 'none' }}>
            <DetailSubWindow imageData={data} />
          </div>
        </div>
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  return prevProps.data.imageUrl === nextProps.data.imageUrl;
});

export default ImageView;