'use client'
import React from 'react';
import { fileInfoType, NONE } from "@/types/fileInfoType"
import dynamic from 'next/dynamic';
import NoImageComponent from '@/components/molecule/noImageComponent';
import DetailSubWindow from '@/components/organism/detailSubWindow';
import { useDetailOpen } from '@/hooks/useDetailOpen';

interface Props {
  data: fileInfoType
}

const ImgViewerTestCompOverRayNoSSR = dynamic(
  () => import('@/components/molecule/imgViewerTestCompOverRay'),
  { ssr: false }
);

export default function ImageView({ data }: Props) {
  const { isDetailOpen } = useDetailOpen();

  if (data == NONE) {
    return <NoImageComponent />
  }

  return (
    <div className="flex justify-center items-center mt-0">
      <div className="grid grid-cols-1 md:grid-cols-12 py-2">
        <div className={`${isDetailOpen ? "col-span-6" : "col-span-11"}  flex justify-center`}>
          <ImgViewerTestCompOverRayNoSSR>
            <img
              src={data.imageUrl}
              alt="sampleImage"
              sizes=""
              className="flex-1 object-contain border-4 border-collapse border-gray-300"
              style={{ borderRadius: '20px', maxHeight: '50vh', maxWidth: '40vw' }}
            />
          </ImgViewerTestCompOverRayNoSSR>
        </div>
        <div className={`${isDetailOpen ? "col-span-6" : "col-span-1"} flex`}>
          <DetailSubWindow />
        </div>
      </div>
    </div>
  )
}