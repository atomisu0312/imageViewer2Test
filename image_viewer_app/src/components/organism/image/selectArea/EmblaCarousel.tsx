'use client'
import React, { useCallback, useEffect, lazy, useState, Suspense } from 'react'
import { EmblaCarouselType, EmblaOptionsType } from 'embla-carousel'
import useEmblaCarousel from 'embla-carousel-react'
import {
  NextButton,
  PrevButton,
  usePrevNextButtons
} from '@/components/organism/image/selectArea/EmblaCarouselArrowButtons'

import { getSampleDataImage } from '@/actions/images/selector'
import { fileInfoType } from '@/types/fileInfoType';

type PropType = {
  options?: EmblaOptionsType
  data: fileInfoType[]
  setTargetData: (data: fileInfoType) => void
}

const ImageCellClickable = lazy(() => import('@/components/organism/image/ImageCellClickable'));

export default function EmblaCarousel({ options, data, setTargetData }: PropType) {
  const [slides, setSlides] = useState(data)

  const [flag, setFlag] = useState(false)
  const [startPage, setStartPage] = useState(0)
  const [endPage, setEndPage] = useState(9)

  const [emblaRef, emblaApi] = useEmblaCarousel({
    ...options,
    watchSlides: (emblaApi) => {
      emblaApi.reInit()
    }
  })

  useEffect(() => {
    setSlides(data)
  }, [data])

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick
  } = usePrevNextButtons(emblaApi)

  const onScroll = useCallback(async (emblaApi: EmblaCarouselType) => {
    if (flag) return
    if (emblaApi.slidesInView().length > 3) return
    setFlag(true)

    if (emblaApi.slidesInView()[emblaApi.slidesInView().length - 1] === data.length - 1) {
      const newStartPage = startPage + 5;
      const newEndPage = endPage + 5;

      const { slides } = await getSampleDataImage({ startPage: newStartPage, endPage: newEndPage })

      setSlides(slides)
      setStartPage(newStartPage)
      setEndPage(newEndPage)

      emblaApi.scrollTo(emblaApi.slidesInView()[0] - 4)
      emblaApi.reInit()

    } else {
      const newStartPage = startPage - 5;
      const newEndPage = endPage - 5;

      if (newStartPage >= 0) {
        const { slides } = await getSampleDataImage({ startPage: newStartPage, endPage: newEndPage })
        setSlides(slides)
        setStartPage(newStartPage)
        setEndPage(newEndPage)

        emblaApi.scrollTo(emblaApi.slidesInView()[0] + 5)
        emblaApi.reInit()
      }
    }
    setFlag(false)

  }, [flag, startPage, endPage, data])

  useEffect(() => {
    if (!emblaApi) return
    emblaApi.on('slidesInView', onScroll)
    return () => {
      emblaApi.off('slidesInView', onScroll)
    }
  }, [emblaApi, onScroll])

  if (slides == undefined) {
    return <div>loading...</div>
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="embla">
        <div className="embla__viewport" ref={emblaRef}>
          <div className="embla__container">
            {flag && (
              <div className="embla__slide">
                <div className="embla__slide__number h-28">
                  <span className="embla-infinite-sscroll__spinner">同期中</span>
                </div>
              </div>
            )}
            {slides.map((e) => (
              <div className="embla__slide flex items-center" key={e.id}>
                <ImageCellClickable data={e} setTargetData={setTargetData} className="h-28" />
              </div>
            ))}
            {flag && (
              <div className="embla__slide flex items-center">
                <div className="embla__slide__number h-28">
                  <span className="embla-infinite-sscroll__spinner" >同期中</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2">
          <div className="col-span-1 flex justify-center">
            <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
          </div>
          <div className="col-span-1 flex justify-center">
            <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
          </div>
        </div>
      </div>
    </Suspense>

  )
}