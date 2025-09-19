'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import ResultDisplay from '@/components/ResultDisplay';
import CommentSection from '@/components/common/CommentSection';
import { ArrowLeft } from 'lucide-react';

interface PersonalityResult {
  type_name: string;
  type_title: string;
  type_description: string;
  keywords: string[];
  strengths: string[];
  weaknesses: string[];
  relationships: string;
  work_style: string;
  stress_response: string;
  growth_tips: string[];
  compatibility_best_type: string;
  compatibility_best_type_title: string;
  compatibility_best_reason: string;
  compatibility_worst_type: string;
  compatibility_worst_type_title: string;
  compatibility_worst_reason: string;
  point: string;
}

export default function PremiumResultPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [result, setResult] = useState<PersonalityResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        // 먼저 URL 파라미터에서 personality_type을 가져오기
        const resultData = searchParams.get('result');
        let personalityType = '';
        
        if (resultData) {
          try {
            const parsedResult = JSON.parse(decodeURIComponent(resultData));
            personalityType = parsedResult.id || parsedResult.type_name || parsedResult.personality_type;
          } catch (error) {
            console.error('결과 데이터 파싱 오류:', error);
          }
        } else {
          // 세션에서 결과 데이터 로드 시도
          const sessionResult = sessionStorage.getItem('analysisResult');
          if (sessionResult) {
            try {
              const parsedResult = JSON.parse(sessionResult);
              personalityType = parsedResult.personalityResult?.id || parsedResult.personalityResult?.type_name || parsedResult.personality_type;
            } catch (error) {
              console.error('세션 데이터 파싱 오류:', error);
            }
          }
        }

        if (!personalityType) {
          router.push(`/analysis/${params.id}/chat`);
          return;
        }

        // API에서 최신 데이터 가져오기 (ID 기반)
        const response = await fetch(`http://127.0.0.1:8000/api/v1/personality-results/${personalityType}`);
        if (!response.ok) {
          throw new Error('API 요청 실패');
        }
        
        const apiResult = await response.json();
        setResult(apiResult.data);
        
      } catch (error) {
        console.error('결과 데이터 로드 오류:', error);
        router.push(`/analysis/${params.id}/chat`);
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [params.id, router, searchParams]);

  const handleRestart = () => {
    router.push(`/analysis/${params.id}/chat`);
  };

  const handleGoHome = () => {
    router.push('/');
  };


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="text-lg mb-2">결과를 불러오는 중...</div>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="text-lg text-red-500 mb-4">결과를 찾을 수 없습니다.</div>
          <button
            onClick={() => router.push(`/analysis/${params.id}/chat`)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            다시 분석하기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* 네비게이션바 */}
      <div className="flex-shrink-0 bg-white">
        <div className="max-w-[700px] mx-auto px-4 py-4 flex items-center">
          <button onClick={() => router.back()} className="text-gray-600 hover:text-gray-800 mr-4 flex-shrink-0">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-lg font-semibold text-gray-900 leading-tight break-words">상세 분석 결과</h2>
        </div>
      </div>

      {/* 상세 결과 */}
      <div className="py-8">
        <ResultDisplay
          result={result}
          onRestart={handleRestart}
          onGoHome={handleGoHome}
        />
      </div>

      {/* 댓글 섹션 */}
      <div className="bg-white w-full">
        <div className="max-w-[700px] mx-auto">
          <CommentSection analysisId={params.id as string} />
        </div>
      </div>
    </div>
  );
}
