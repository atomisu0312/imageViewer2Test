'use client'
import React, { use, useEffect, useRef, useState } from 'react';
import { fileInfoType, NONE } from "@/types/fileInfoType"
import dynamic from 'next/dynamic';
import NoImageComponent from '@/components/molecule/noImageComponent';

interface Props {
  data: fileInfoType
}

const ImgViewerTestCompOverRayNoSSR = dynamic(
  () => import('@/components/molecule/imgViewerTestCompOverRay'),
  { ssr: false }
);

export default function ImageView({ data }: Props) {
  if (data == NONE) {
    return <NoImageComponent />
  }

  return (
    <div className="flex justify-center items-center mt-0">
      <ImgViewerTestCompOverRayNoSSR>
        <img
          src={data.imageUrl}
          alt="sampleImage"
          sizes=""
          className="flex-1 object-contain border-4 border-collapse border-gray-300"
          style={{ borderRadius: '70px', maxHeight: '50vh' }}
        />
      </ImgViewerTestCompOverRayNoSSR>
    </div>
  )
}