'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import CommentSection from '@/components/common/CommentSection';

interface Analysis {
  id: string;
  title: string;
  description: string;
  total_questions: string;
  result_type: string;
}

export default function AnalysisPage() {
  const params = useParams();
  const router = useRouter();
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/v1/analysis/${params.id}`);
        if (response.ok) {
          const data = await response.json();
          setAnalysis(data);
        }
      } catch (error) {
        console.error('분석 정보 조회 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [params.id]);

  const handleStartTest = () => {
    // 모든 분석을 바로 채팅창으로 이동 (성별 선택은 채팅에서)
    if (params.id === 'egen-teto') {
      router.push('/analysis/egen-teto');
    } else if (params.id === 'bdsm') {
      router.push('/analysis/bdsm');
    } else {
      // 일반 분석의 경우도 바로 채팅창으로 이동
      router.push(`/analysis/${params.id}/chat`);
    }
  };

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

  const getEstimatedTime = (questionCount: string) => {
    const count = parseInt(questionCount);
    return Math.ceil(count * 0.5); // 질문당 30초 소요로 계산
  };

  const getHashtags = (resultType: string) => {
    switch (resultType) {
      case 'binary_pairs':
        return ['#성격분석', '#MBTI', '#성향테스트', '#16유형'];
      case 'continuous':
        return ['#심리분석', '#성향테스트', '#자기이해'];
      case 'categories':
        return ['#분류테스트', '#성향분석', '#카테고리'];
      case 'custom':
        return ['#맞춤분석', '#성향테스트', '#개인화'];
      default:
        return ['#성향분석', '#테스트'];
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">로딩 중...</div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-red-500">분석을 찾을 수 없습니다.</div>
      </div>
    );
  }

  const { color, bgColor, category } = getCategoryColor(analysis.result_type);
  const estimatedTime = getEstimatedTime(analysis.total_questions);
  const hashtags = getHashtags(analysis.result_type);

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-[700px] mx-auto px-4">
        {/* 뒤로가기 네비게이션 */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            뒤로가기
          </button>
        </div>
        
        <div>
          {/* 상단 섹션: 썸네일 + 기본 정보 */}
          <div className="flex flex-col lg:flex-row">
            {/* 썸네일 */}
            <div className="relative w-full lg:w-72 h-64 lg:h-72 bg-gradient-to-br from-gray-100 to-gray-200 flex-shrink-0 ml-6 lg:ml-8 my-6 lg:my-8">
              <div className={`absolute inset-0 ${bgColor} opacity-20`}></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className={`w-20 h-20 ${color} rounded-full flex items-center justify-center`}>
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
              </div>
              {/* 카테고리 배지 */}
              <div className="absolute top-3 left-3">
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${bgColor} ${color}`}>
                  {category}
                </span>
              </div>
            </div>

            {/* 기본 정보 */}
            <div className="flex-1 p-6 lg:p-8 pr-6 lg:pr-8">
              <h1 className="text-2xl lg:text-xl font-bold text-gray-900 mb-2 lg:mb-4 leading-tight">
                {analysis.title}
              </h1>
              
              {/* 테스트 정보 */}
              <div className="space-y-1 mb-4 lg:mb-6">
                <div className="flex items-center text-gray-600">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm lg:text-base">{analysis.total_questions}개 질문</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm lg:text-base">약 {estimatedTime}분 소요</span>
                </div>
              </div>
            </div>
          </div>

          {/* 하단 섹션: 설명 + 해시태그 + 버튼 */}
          <div className="px-6 lg:px-8 pb-6 lg:pb-8">
            {/* 설명 */}
            <div className="text-gray-700 mb-5 lg:mb-6 leading-relaxed text-sm lg:text-base mt-6 lg:mt-8">
              {analysis.description}
            </div>
            
            {/* 해시태그 */}
            <div className="flex flex-wrap gap-2 mb-6 lg:mb-8">
              {hashtags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2.5 py-1.5 bg-gray-100 text-gray-600 rounded-full text-xs lg:text-sm hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  {tag}
                </span>
              ))}
            </div>
            
            {/* 테스트 시작 버튼 */}
            <button
              onClick={handleStartTest}
              className="w-full bg-blue-600 text-white py-3 lg:py-4 px-6 rounded-xl font-semibold text-base lg:text-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
            >
              테스트 시작하기
            </button>
          </div>
        </div>
      </div>
      
      {/* 댓글 섹션 */}
      <CommentSection analysisId={params.id as string} />
    </div>
  );
}
