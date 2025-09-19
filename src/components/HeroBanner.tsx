'use client';

import { useState } from 'react';

interface CarouselItem {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

const carouselItems: CarouselItem[] = [
  {
    id: 1,
    title: "외향성 분석",
    description: "사회적 상호작용과 에너지 방식을 알아보세요",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    )
  },
  {
    id: 2,
    title: "개방성 분석",
    description: "새로운 경험에 대한 개방성을 확인하세요",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    )
  },
  {
    id: 3,
    title: "성실성 분석",
    description: "목표 지향적이고 체계적인 성향을 파악하세요",
    color: "text-green-600",
    bgColor: "bg-green-50",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  {
    id: 4,
    title: "친화성 분석",
    description: "협력적이고 신뢰하는 성향을 알아보세요",
    color: "text-pink-600",
    bgColor: "bg-pink-50",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    )
  },
  {
    id: 5,
    title: "신경성 분석",
    description: "감정적 안정성과 스트레스 대응을 확인하세요",
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
      </svg>
    )
  }
];

export default function HeroBanner() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? carouselItems.length - 1 : currentIndex - 1);
  };

  const goToNext = () => {
    setCurrentIndex(currentIndex === carouselItems.length - 1 ? 0 : currentIndex + 1);
  };

  return (
    <div className="relative w-full">
      {/* Carousel Container */}
      <div className="relative overflow-hidden max-w-[700px] h-[400px] mx-auto">
        <div 
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {carouselItems.map((item) => (
            <div key={item.id} className="w-full flex-shrink-0 h-[400px]">
              <div className={`${item.bgColor} h-full flex flex-col justify-center items-center p-8 text-center`}>
                <div className={`w-16 h-16 ${item.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  {item.icon}
                </div>
                <h3 className={`text-xl md:text-2xl font-bold ${item.color} mb-3`}>
                  {item.title}
                </h3>
                <p className="text-base text-gray-700 max-w-sm mx-auto">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Dots Indicator - 캐로셀 위에 겹쳐서 표시 */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex justify-center space-x-3 z-10">
          {carouselItems.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`rounded-full transition-all duration-300 ease-in-out ${
                index === currentIndex 
                  ? 'w-8 h-3 bg-pink-500' 
                  : 'w-3 h-3 bg-white/50 hover:bg-pink-500 hover:scale-110'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Navigation Arrows - 안쪽 16px */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-600 hover:text-gray-900 rounded-full p-2 transition-all duration-200"
        aria-label="Previous slide"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-600 hover:text-gray-900 rounded-full p-2 transition-all duration-200"
        aria-label="Next slide"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}
