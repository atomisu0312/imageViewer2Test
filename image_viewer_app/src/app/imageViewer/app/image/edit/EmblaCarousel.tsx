'use client'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { EmblaCarouselType, EmblaOptionsType } from 'embla-carousel'
import useEmblaCarousel from 'embla-carousel-react'
import {
  NextButton,
  PrevButton,
  usePrevNextButtons
} from './EmblaCarouselArrowButtons'

import { getSampleData } from '@/actions/images/selector'

const mockApiCall = (
  minWait: number,
  maxWait: number,
  callback: () => void
): void => {
  const min = Math.ceil(minWait)
  const max = Math.floor(maxWait)
  const wait = Math.floor(Math.random() * (max - min + 1)) + min
  setTimeout(callback, wait)
}

type PropType = {
  slides: number[]
  options?: EmblaOptionsType
}

const EmblaCarousel: React.FC<PropType> = (props) => {
  const { options, slides: propSlides } = props
  const [slides, setSlides] = useState(propSlides)
  const [flag, setFlag] = useState(false)

  const [startPage, setStartPage] = useState(0)
  const [endPage, setEndPage] = useState(19)

  const [emblaRef, emblaApi] = useEmblaCarousel({
    ...options,
    watchSlides: (emblaApi) => {
      emblaApi.reInit()
    }
  })

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick
  } = usePrevNextButtons(emblaApi)

  const onScroll = useCallback(async (emblaApi: EmblaCarouselType) => {
    if (flag) return
    console.log(emblaApi.slidesInView())

    if (emblaApi.slidesInView().length > 3) return
    setFlag(true)

    if (emblaApi.slidesInView()[emblaApi.slidesInView().length - 1] === slides.length - 1) {
      const newStartPage = startPage + 5;
      const newEndPage = endPage + 5;

      const data = await getSampleData({ startPage: newStartPage, endPage: newEndPage })
      const newSlides = data["slides"]

      setSlides(newSlides)
      setStartPage(newStartPage)
      setEndPage(newEndPage)

      emblaApi.scrollTo(emblaApi.slidesInView()[0] - 4)

    } else {
      const newStartPage = startPage - 5;
      const newEndPage = endPage - 5;
      if (newStartPage >= 0) {
        const data = await getSampleData({ startPage: newStartPage, endPage: newEndPage })
        const newSlides = data["slides"]

        setSlides(newSlides)
        setStartPage(newStartPage)
        setEndPage(newEndPage)

        emblaApi.scrollTo(emblaApi.slidesInView()[0] + 6)
      }
    }

    emblaApi.reInit()
    setFlag(false)


  }, [flag, startPage, endPage, slides])

  useEffect(() => {
    if (!emblaApi) return
    emblaApi.on('slidesInView', onScroll)
    return () => {
      emblaApi.off('slidesInView', onScroll)
    }
  }, [emblaApi, onScroll])

  return (
    <div className="embla">
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
          {flag && (
            <div className="embla__slide">
              <div className="embla__slide__number">
                <span className="embla-infinite-sscroll__spinner" >Sync</span>
              </div>
            </div>
          )}
          {slides.map((index) => (
            <div className="embla__slide" key={index}>
              <div className="embla__slide__number">
                <span>{index + 1}</span>
              </div>
            </div>
          ))}
          {flag && (
            <div className="embla__slide">
              <div className="embla__slide__number">
                <span className="embla-infinite-sscroll__spinner" >Sync</span>
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

      <span className="">{flag ? "true" : "false"}</span>
    </div>
  )
}

export default EmblaCarousel