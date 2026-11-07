'use client';

import React, { useRef, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/navigation';
import { productType } from '@/types';
import ProductCard from './ProductCard';

const HotSellersCorousal = ({products}: {products: productType[]}) => {
  const prevRef = useRef<HTMLButtonElement | null>(null);
  const nextRef = useRef<HTMLButtonElement | null>(null);
  const swiperRef = useRef<any>(null);

  useEffect(() => {
    if (swiperRef.current && prevRef.current && nextRef.current) {
      swiperRef.current.params.navigation.prevEl = prevRef.current;
      swiperRef.current.params.navigation.nextEl = nextRef.current;
      swiperRef.current.navigation.init();
      swiperRef.current.navigation.update();
    }
  }, []);

    const hotSellersProducts = products.filter(product => product.hotSeller);


  return (
    <section className="relative w-full">
      
      {/* Swiper */}
      <Swiper
        modules={[Navigation]}
        spaceBetween={24}
        slidesPerGroup={2}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        breakpoints={{
            0: {
            slidesPerView: 1,
            slidesPerGroup: 1,
            },
            480: {
            slidesPerView: 1,
            slidesPerGroup: 1,
            },
            640: {
            slidesPerView: 2,
            slidesPerGroup: 2,
            },
            908: {
            slidesPerView: 3,
            slidesPerGroup: 2,
            },
            1224: {
            slidesPerView: 4,
            slidesPerGroup: 2,
            },
        }}
        >
        {hotSellersProducts.map((item, index) => (
          <SwiperSlide key={index}>
            {/* <ProductCard collectionSlug='all' {...item} /> */}
            <ProductCard {...item} />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Navigation */}
      <div className="flex  items-center justify-end gap-6 mt-2 sm:mt-6 mr-6">
        <button
          ref={prevRef}
          aria-label="Previous"
          className="bg-light-beige hover:bg-contrast-beige rounded-full p-2.5 sm:p-3.5 border border-contrast-beige text-contrast-beige hover:text-light-beige cursor-pointer transition-all duration-300"
        >
          <ArrowLeft />
        </button>
        <button
          ref={nextRef}
          aria-label="Next"
          className="bg-light-beige hover:bg-contrast-beige rounded-full p-2.5 sm:p-3.5 border border-contrast-beige text-contrast-beige hover:text-light-beige cursor-pointer transition-all duration-300"
        >
          <ArrowRight />
        </button>
      </div>
    </section>
  );
}

export default HotSellersCorousal

