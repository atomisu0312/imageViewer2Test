'use client'
import '@/app/globals.css';
import { EmblaOptionsType } from 'embla-carousel'
import EmblaCarousel from './EmblaCarousel'
const OPTIONS: EmblaOptionsType = {
  dragFree: true,
  containScroll: 'keepSnaps',
  watchSlides: false,
  watchResize: false
}
const SLIDE_COUNT = 5
const SLIDES = Array.from(Array(SLIDE_COUNT).keys())
/**
 * appページ用のエンドポイント
 * @returns 
 */
export default function Page() {
  return (
    <EmblaCarousel slides={SLIDES} options={OPTIONS} />
  );
}