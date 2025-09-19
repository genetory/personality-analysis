'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { CommonSectionTitle } from '@/components/common';

interface Analysis {
  id: string;
  name: string;
  description: string;
  category: string;
  participants: number;
  thumb_image_url?: string;
  is_active: number;
  created_at: string;
  updated_at: string;
}

export default function AnalysisList() {
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchAnalyses = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/v1/analysis/');
        if (response.ok) {
          const data = await response.json();
          // 최대 6개만 표시
          setAnalyses(data.slice(0, 6));
        }
      } catch (error) {
        console.error('분석 목록 조회 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyses();
  }, []);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case '성격':
        return { color: 'text-blue-600', bgColor: 'bg-blue-50' };
      case '심리':
        return { color: 'text-green-600', bgColor: 'bg-green-50' };
      case '분류':
        return { color: 'text-purple-600', bgColor: 'bg-purple-50' };
      case '맞춤':
        return { color: 'text-orange-600', bgColor: 'bg-orange-50' };
      default:
        return { color: 'text-gray-600', bgColor: 'bg-gray-50' };
    }
  };

  const handleImageError = (analysisId: string) => {
    setImageErrors(prev => new Set(prev).add(analysisId));
  };

  return (
    <div className="w-full px-4 py-16">
      <div className="max-w-[700px] mx-auto">
        {/* Section Header */}
        <CommonSectionTitle
          title="인기 성향분석"
          subtitle="많은 사람들이 선택한 인기 있는 성향분석을 만나보세요"
        />



        {/* Analysis Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 animate-pulse flex flex-col h-80">
                <div className="h-44 bg-gray-200"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {analyses.map((analysis) => {
              const { color, bgColor } = getCategoryColor(analysis.category);
              
              return (
                <Link
                  key={analysis.id}
                  href={`/analysis/${analysis.id}`}
                  className="group block"
                >
                  <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-gray-200 flex flex-col h-80">
                    {/* Image */}
                    <div className="relative h-44 bg-gradient-to-br from-gray-100 to-gray-200">
                      {analysis.thumb_image_url && !imageErrors.has(analysis.id) ? (
                        <Image 
                          src={analysis.thumb_image_url} 
                          alt={analysis.name}
                          fill
                          className="object-cover"
                          onError={() => handleImageError(analysis.id)}
                        />
                      ) : (
                        <>
                          <div className={`absolute inset-0 ${bgColor} opacity-20`}></div>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className={`w-16 h-16 ${color} rounded-full flex items-center justify-center`}>
                              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                              </svg>
                            </div>
                          </div>
                        </>
                      )}
                      {/* Category Badge */}
                      <div className="absolute top-4 left-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${bgColor} ${color}`}>
                          {analysis.category}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 flex flex-col flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {analysis.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-1">
                        {analysis.description || '나를 더 깊이 알아보는 성향분석입니다.'}
                      </p>
                      
                      {/* Participants Count */}
                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-center text-sm text-gray-500">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          <span>{analysis.participants.toLocaleString()}명 참여</span>
                        </div>
                        <div className="text-blue-600 text-sm font-medium group-hover:text-blue-700">
                          분석하기 →
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link
            href="/analyses"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            모든 성향분석 보기
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
