import { getDataFromApiKey, getDataSample } from '@/actions/fileActions';
import { fileInfoType } from '@/types/fileInfoType';
import React, { useEffect, useState, Suspense, lazy } from 'react';

const ImageCell = lazy(() => import('@/components/organism/ImageCell'));

interface Props {
  setTargetData: (data: fileInfoType | undefined) => void
}

export default function SelectAreaNew({ setTargetData }: Props) {
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

    <div className="flex flex-wrap justify-center px-5">
      <Suspense fallback={<div>Loading...</div>}>
        {data && data.map((e) =>
          <ImageCell key={e.id} data={e} setTargetData={setTargetData} />
        )}
      </Suspense>
    </div>
  );
}