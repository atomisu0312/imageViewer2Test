'use client';

import { getDataSample } from '@/actions/fileActions';
import '@/app/globals.css';
import ImageView from '@/components/template/imageView';
import SelectArea from '@/components/template/selectArea';
import { fileInfoType, NONE } from '@/types/fileInfoType';
import React, { useEffect, useState } from 'react';

/**
 * アプリそのもの
 * @returns
 */
export function AppFront() {
  const [data, setData] = useState<fileInfoType[]>([]);
  const [targetData, setTargetData] = useState<fileInfoType>(NONE);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // データ更新を任意のタイミングで可能にするために、データ更新用の関数を準備
  const fetchAndSetData = async () => {
    setIsLoading(true);
    const result = await getDataSample();
    setData(result);
    setIsLoading(false);
    setTargetData(NONE);
  };

  useEffect(() => {
    fetchAndSetData();
  }, []);
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-12 py-2">
        <div className="col-span-1"></div>
        <>
          <div className="col-span-10">
            <ImageView data={targetData} />
          </div>
        </>
        <div className="col-span-1"></div>
      </div>
      <div className="grid grid-cols-1">
        <div className="col-span-1">
          {isLoading ? <><span>データ取り込み中</span></> :
            <SelectArea data={data} setTargetData={setTargetData} />}
        </div>
      </div>
    </>
  );
}