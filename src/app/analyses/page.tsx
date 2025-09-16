'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CommonSectionTitle } from '@/components/common';

interface Analysis {
  id: string;
  title: string;
  description: string;
  total_questions: string;
  result_type: string;
  created_at: string;
}

export default function AnalysesPage() {
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalyses = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/v1/analysis/');
        if (response.ok) {
          const data = await response.json();
          setAnalyses(data);
        } else {
          setError('분석 목록을 불러오는데 실패했습니다.');
        }
      } catch (error) {
        console.error('분석 목록 조회 실패:', error);
        setError('서버 연결에 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyses();
  }, []);

  const getCategoryColor = (resultType: string) => {
    switch (resultType) {
      case 'binary_pairs':
        return { color: 'text-blue-600', bgColor: 'bg-blue-50', category: '성격' };
      case 'continuous':
        return { color: 'text-green-600', bgColor: 'bg-green-50', category: '심리' };
      case 'categories':
        return { color: 'text-purple-600', bgColor: 'bg-purple-50', category: '분류' };
      case 'custom':
        return { color: 'text-orange-600', bgColor: 'bg-orange-50', category: '맞춤' };
      default:
        return { color: 'text-gray-600', bgColor: 'bg-gray-50', category: '기타' };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <div className="text-lg">분석 목록을 불러오는 중...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <div className="text-lg text-red-500">{error}</div>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              다시 시도
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-6xl mx-auto px-4">
        {/* Section Header */}
        <CommonSectionTitle
          title="모든 성향분석"
          subtitle="다양한 성향분석으로 나를 더 깊이 알아보세요"
        />

        {/* Analysis List */}
        <div className="space-y-4">
          {analyses.map((analysis) => {
            const { color, bgColor, category } = getCategoryColor(analysis.result_type);
            
            return (
              <div key={analysis.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-gray-200 overflow-hidden">
                <div className="flex">
                  {/* Thumbnail */}
                  <div className="relative w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 flex-shrink-0 flex items-center justify-center p-4">
                    <div className={`absolute inset-0 ${bgColor} opacity-20`}></div>
                    <div className={`w-12 h-12 ${color} rounded-full flex items-center justify-center relative z-10`}>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    {/* Category Badge */}
                    <div className="absolute top-2 left-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${bgColor} ${color}`}>
                        {category}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 px-6 py-6 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {analysis.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {analysis.description || '나를 더 깊이 알아보는 성향분석입니다.'}
                      </p>
                    </div>
                    
                    {/* Analysis Info */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-500">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{analysis.total_questions}개 질문</span>
                      </div>
                      <Link
                        href={`/analysis/${analysis.id}`}
                        className="text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors"
                      >
                        분석하기 →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {analyses.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">등록된 분석이 없습니다.</div>
          </div>
        )}

        {/* Back to Home */}
        <div className="text-center mt-12">
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}
