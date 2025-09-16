'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import CommentSection from '@/components/common/CommentSection';

interface ResultInterpretation {
  section: string;
  content: string;
}

interface ResultType {
  id: string;
  result_key: string;
  title: string;
  subtitle?: string;
  gender: string;
  interpretations: ResultInterpretation[];
}

interface Result {
  id: string;
  session_id: string;
  analysis_id: string;
  dimension_scores: Record<string, number>;
  result_data: {
    result_key: string;
    gender: string;
  };
  created_at: string;
}

export default function ResultPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [result, setResult] = useState<Result | null>(null);
  const [resultType, setResultType] = useState<ResultType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sessionId = searchParams.get('session');
    const gender = searchParams.get('gender');
    
    if (!sessionId || !gender) {
      router.push(`/analysis/${params.id}`);
      return;
    }

    const fetchResult = async () => {
      try {
        console.log('세션 ID:', sessionId);
        console.log('성별:', gender);
        
        // 1. 세션 결과 조회
        const resultResponse = await fetch(`http://127.0.0.1:8000/api/v1/results/session/${sessionId}?gender=${gender}`);
        console.log('결과 API 응답 상태:', resultResponse.status);
        
        if (!resultResponse.ok) {
          console.error('결과 API 에러:', resultResponse.status, resultResponse.statusText);
          alert(`결과를 찾을 수 없습니다. (상태: ${resultResponse.status})`);
          router.push(`/analysis/${params.id}`);
          return;
        }
        
        const resultData = await resultResponse.json();
        console.log('결과 데이터:', resultData);
        setResult(resultData);
        
        // 2. 결과 타입과 해석 조회
        const resultKey = resultData.result_type;
        const resultGender = resultData.gender || gender || 'female'; // 기본값 설정
        
        console.log('결과 키:', resultKey);
        console.log('성별:', resultGender);
        
        if (resultKey && resultGender) {
          const resultTypeUrl = `http://127.0.0.1:8000/api/v1/result-types/analysis/${params.id}/result-types/${resultKey}/${resultGender}`;
          console.log('결과 타입 API URL:', resultTypeUrl);
          
          const resultTypeResponse = await fetch(resultTypeUrl);
          console.log('결과 타입 API 응답 상태:', resultTypeResponse.status);
          
          if (resultTypeResponse.ok) {
            const resultTypeData = await resultTypeResponse.json();
            console.log('결과 타입 데이터:', resultTypeData);
            setResultType(resultTypeData);
          } else {
            console.error('결과 타입 조회 실패:', resultTypeResponse.status, resultTypeResponse.statusText);
            const errorText = await resultTypeResponse.text();
            console.error('에러 내용:', errorText);
          }
        } else {
          console.error('결과 키 또는 성별이 없습니다:', { resultKey, resultGender });
        }
      } catch (error) {
        console.error('결과 조회 실패:', error);
        alert('결과 조회에 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [params.id, searchParams, router]);

  const handleRetakeTest = () => {
    router.push(`/analysis/${params.id}/gender`);
  };

  const handleGoHome = () => {
    router.push('/');
  };

  // 섹션별 아이콘 반환 함수
  const getSectionIcon = (section: string) => {
    const icons: Record<string, string> = {
      '성격 특징': '🎭',
      '인간관계': '👥',
      '연애 스타일': '💕',
      '섹스할 때': '🔥',
      '일상 패턴': '📅',
      '강점': '💪',
      '주의할 점': '⚠️',
      '한 줄 정리': '✨',
      '추천 체위': '🛏️',
      '궁합': '💕',
      '오늘 밤 시뮬레이션': '🌙'
    };
    return icons[section] || '📝';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg mb-2">결과를 불러오는 중...</div>
          <div className="text-sm text-gray-500">
            세션: {searchParams.get('session')}<br/>
            성별: {searchParams.get('gender')}
          </div>
        </div>
      </div>
    );
  }

  if (!result || !resultType) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg text-red-500 mb-4">결과를 찾을 수 없습니다.</div>
          <div className="text-sm text-gray-500 mb-4">
            <div>세션: {searchParams.get('session')}</div>
            <div>성별: {searchParams.get('gender')}</div>
            <div>결과 데이터: {result ? '있음' : '없음'}</div>
            <div>결과 타입: {resultType ? '있음' : '없음'}</div>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            새로고침
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-[700px] mx-auto px-6 lg:px-8 mb-8">
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
        {/* 결과 헤더 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-full text-2xl font-bold mb-4">
            🎯
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            분석 결과
          </h1>
          <p className="text-gray-600">
            당신의 성향 분석이 완료되었습니다
          </p>
        </div>

        {/* 결과 섹션 */}
        <div className="mb-8">
          {/* 결과 유형 */}
          <div className="text-center mb-8">
            <div className="inline-block bg-blue-100 text-blue-800 px-6 py-3 rounded-full text-xl font-bold mb-4">
              {resultType.title}
            </div>
            {resultType.subtitle && (
              <p className="text-gray-600 text-base mb-3 italic">
                "{resultType.subtitle}"
              </p>
            )}
          </div>

          {/* 상세 해석 섹션들 */}
          <div className="space-y-6">
            {resultType.interpretations.map((interpretation, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {getSectionIcon(interpretation.section)} {interpretation.section}
                </h3>
                <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {interpretation.content}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 액션 버튼 */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleRetakeTest}
            className="px-8 py-3 bg-white text-blue-600 border-2 border-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors"
          >
            다시 테스트하기
          </button>
          <button
            onClick={handleGoHome}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            홈으로 돌아가기
          </button>
          <button
            onClick={() => {
              if (navigator.share) {
                const shareText = resultType.subtitle 
                  ? `나의 성향은 ${resultType.title}입니다!\n${resultType.subtitle}`
                  : `나의 성향은 ${resultType.title}입니다!`;
                
                navigator.share({
                  title: '성향분석 결과',
                  text: shareText,
                  url: window.location.href
                });
              } else {
                navigator.clipboard.writeText(window.location.href);
                alert('링크가 복사되었습니다!');
              }
            }}
            className="px-8 py-3 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-colors"
          >
            공유하기
          </button>
        </div>
      </div>
      
      {/* 댓글 섹션 */}
      <CommentSection analysisId={params.id as string} />
    </div>
  );
}
