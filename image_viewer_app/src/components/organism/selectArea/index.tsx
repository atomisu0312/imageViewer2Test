
import '@/app/globals.css';
import { EmblaOptionsType } from 'embla-carousel'
import EmblaCarousel from './EmblaCarousel'
const OPTIONS: EmblaOptionsType = {
  dragFree: true,
  containScroll: 'keepSnaps',
  watchSlides: false,
  watchResize: false
}
import { getDataSample } from '@/actions/fileActions';
import { fileInfoType } from '@/types/fileInfoType';
import React, { useEffect, useState, Suspense, lazy } from 'react';



/**
 * appページ用のエンドポイント
 * @returns 
 */
export default function Page({ setTargetData }) {
  const [data, setData] = useState<fileInfoType[] | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // ここでデータを非同期にフェッチ
        const result = await getDataSample();
        setData(result);
      } catch (error) {
        console.error('データのフェッチに失敗しました', error);
      }
    };

    fetchData();
  }, []);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EmblaCarousel options={OPTIONS} data={data} setTargetData={setTargetData} />
    </Suspense>
  );
}