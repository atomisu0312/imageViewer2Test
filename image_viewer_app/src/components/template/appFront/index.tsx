'use client';

import '@/app/globals.css';
import ImageView from '@/components/template/imageView';
import SelectArea from '@/components/organism/selectArea';
import { fileInfoType, NONE } from '@/types/fileInfoType';
import React, { useState } from 'react';
import { store } from '@/store/store';
import { Provider } from 'react-redux'
import AppHeader from '@/components/organism/appHeader';

/**
 * アプリそのもの
 * @returns
 */
export function AppFront() {
  const [targetData, setTargetData] = useState<fileInfoType>(NONE);

  return (
    <Provider store={store}>
      <div className="grid grid-cols-1">
        <div className="col-span-1">
          <AppHeader/>
        </div>
      </div>
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
    </Provider>
  );
}