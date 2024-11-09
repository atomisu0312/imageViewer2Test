'use client'
import '@/app/globals.css';
import { EmblaOptionsType } from 'embla-carousel'

const OPTIONS: EmblaOptionsType = {
  dragFree: true,
  containScroll: 'trimSnaps',
  watchSlides: false,
  watchResize: true
}
const SLIDE_COUNT = 10
const SLIDES = Array.from(Array(SLIDE_COUNT).keys())
import EmblaCarouselOnlyNumber from './EmblaCarouselOnlyNumber';

/**
 * appページ用のエンドポイント
 * @returns 
 */
export default function Page() {
  return (
    <EmblaCarouselOnlyNumber slides={SLIDES} options={OPTIONS} />
  );
}