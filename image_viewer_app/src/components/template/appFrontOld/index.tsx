'use client';

import '@/app/globals.css';
import ImageView from '@/components/template/imageView';
import SelectArea from '@/components/template/selectAreaOld';
import { fileInfoType, NONE } from '@/types/fileInfoType';
import React, { useState } from 'react';

/**
 * アプリそのもの
 * @returns
 */
export function AppFrontOld() {
  const [targetData, setTargetData] = useState<fileInfoType>(NONE);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-12 py-2">
        <div className="col-span-1"></div>
        <div className="col-span-10">
          <ImageView data={targetData} />
        </div>
        <div className="col-span-1"></div>
      </div>
      <div className="grid grid-cols-1">
        <div className="col-span-1">
          <SelectArea setTargetData={setTargetData} />
        </div>
      </div>
    </>
  );
}