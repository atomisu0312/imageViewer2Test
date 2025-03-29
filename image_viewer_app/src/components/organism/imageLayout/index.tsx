'use client';
import { memo, useMemo } from 'react';
import dynamic from 'next/dynamic';

const ImgViewerTestCompOverRayNoSSR = dynamic(
  () => import('@/components/molecule/imgViewerTestCompOverRay'),
  { ssr: false }
);

interface ImageLayoutProps {
  imageUrl: string;
}

const ImageLayout = memo(function ImageLayout({ imageUrl }: ImageLayoutProps) {
  const imageComponent = useMemo(() => (
    <img
      src={imageUrl}
      alt="sampleImage"
      sizes=""
      className="flex-1 object-contain border-4 border-collapse border-gray-300"
      style={{ borderRadius: '20px', maxHeight: '50vh', maxWidth: '40vw' }}
    />
  ), [imageUrl]);

  return (
    <div className="flex justify-center">
      <ImgViewerTestCompOverRayNoSSR>
        {imageComponent}
      </ImgViewerTestCompOverRayNoSSR>
    </div>
  );
});

export default ImageLayout; 