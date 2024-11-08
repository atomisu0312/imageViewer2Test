'use client'

import { getDataFromApiKey, getData } from '@/actions/fileActions';
import ImageCell from '@/components/organism/ImageCell';
import { fileInfoType } from '@/types/fileInfoType';
import React, { useEffect, useState, Suspense } from 'react';

interface Props {
  setTargetData: (data: fileInfoType | undefined) => void
}

export default async function SelectAreaNew({ setTargetData }: Props) {
  const data = await getData();

  return (<div className="flex flex-wrap justify-center">
    {data.map((e) =>
      <ImageCell key={e.id} data={e} setTargetData={setTargetData} />)}
  </div>)
}