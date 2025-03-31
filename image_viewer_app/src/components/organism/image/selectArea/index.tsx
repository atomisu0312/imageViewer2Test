import '@/app/globals.css';
import '@/app/app/image/embra.css';
import { EmblaOptionsType } from 'embla-carousel'
import EmblaCarousel from './EmblaCarousel'
const OPTIONS: EmblaOptionsType = {
  dragFree: true,
  containScroll: 'keepSnaps',
  watchSlides: false,
  watchResize: false
}
import { getSampleDataImage } from '@/actions/images/selector';
import { fileInfoType } from '@/types/fileInfoType';
import React, { useEffect, useState, Suspense } from 'react';

/**
 * appページ用のエンドポイント
 * @returns 
 */
export default function Page({ setTargetData }) {
  const [data, setData] = useState<fileInfoType[] | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 初期データを取得（0から9までのスライド）
        const result = await getSampleDataImage({ startPage: 0, endPage: 9 });
        setData(result.slides);
      } catch (error) {
        console.error('データのフェッチに失敗しました', error);
      }
    };

    fetchData();
  }, []);

  if (!data) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Suspense fallback={<div className="flex items-center justify-center h-64">Loading...</div>}>
        <EmblaCarousel options={OPTIONS} data={data} setTargetData={setTargetData} />
      </Suspense>
    </div>
  );
}