'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import PersonalityResult from '@/components/PersonalityResult';
import { ArrowLeft } from 'lucide-react';

interface PersonalityResult {
  type: string;
  summary: {
    catchphrase: string;
    keywords: string[];
  };
  strengths: string[];
  weaknesses: string[];
  relationships: string;
  workStyle: string;
  stressResponse: string;
  growthTips: string[];
  compatibility: {
    best: {
      type: string;
      reason: string;
    };
    worst: {
      type: string;
      reason: string;
    };
  };
}

export default function PremiumResultPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [result, setResult] = useState<PersonalityResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // URL에서 결과 데이터를 가져오거나 세션에서 로드
    const resultData = searchParams.get('result');
    if (resultData) {
      try {
        const parsedResult = JSON.parse(decodeURIComponent(resultData));
        setResult(parsedResult);
      } catch (error) {
        console.error('결과 데이터 파싱 오류:', error);
        router.push(`/analysis/${params.id}/chat`);
      }
    } else {
      // 세션에서 결과 데이터 로드 시도
      const sessionResult = sessionStorage.getItem('analysisResult');
      if (sessionResult) {
        try {
          const parsedResult = JSON.parse(sessionResult);
          setResult(parsedResult.personalityResult);
        } catch (error) {
          console.error('세션 데이터 파싱 오류:', error);
          router.push(`/analysis/${params.id}/chat`);
        }
      } else {
        router.push(`/analysis/${params.id}/chat`);
      }
    }
    setLoading(false);
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
    <div className="min-h-screen bg-gray-100">
      {/* 네비게이션바 */}
      <div className="flex-shrink-0 bg-white p-4 flex items-center">
        <div className="max-w-[700px] mx-auto w-full flex items-center">
          <button onClick={() => router.back()} className="text-gray-600 hover:text-gray-800 mr-4">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-lg font-semibold text-gray-900">상세 분석 결과</h2>
        </div>
      </div>


      {/* 상세 결과 */}
      <div className="py-8">
        <PersonalityResult
          result={result}
          onRestart={handleRestart}
          onGoHome={handleGoHome}
        />
      </div>

    </div>
  );
}
